import { dbKeys } from 'src/app/keys.config';
import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import { first, map, tap, takeUntil, exhaustMap, debounceTime, shareReplay } from 'rxjs/operators';
import { Chapter, ChapterMeta } from 'src/app/shared/models/novels/chapter.model';
import { NovelService } from './novel.service';
import { ChaptersStats, ChaptersList, TOC } from 'src/app/shared/models/novels/chapters-stats.model';
import { Observable, of, BehaviorSubject, Subject } from 'rxjs';
import { HistoryService } from './history.service';
import { HistoryNovel } from 'src/app/shared/models/history/history.model';

interface TmpChStats {
  stats: ChaptersStats;
  chapter: Chapter;
}

export interface ChaptersQuery {
  novelID: string;
  reverse: boolean; // reverse order
  prepend: boolean; // prepend to source
}

@Injectable({
  providedIn: 'root'
})
export class ChaptersService implements OnDestroy {
  private end: Subject<void> = new Subject();

  private query: ChaptersQuery;
  private novelID: string;
  private cursor: string;
  private cursorPrev: string;
// tslint:disable: variable-name
  private _done = new BehaviorSubject(false);
  private _loading = new BehaviorSubject(false);
  private _data = new BehaviorSubject<Chapter[]>([]);
// tslint:enable: variable-name

  // Observable data
  data: Observable<Chapter[]> = this._data.asObservable();
  done: Observable<boolean> = this._done.asObservable();
  loading: Observable<boolean> = this._loading.asObservable();
  readToc: TOC;
  readToc$: Observable<TOC>;

  constructor(
    private afs: AngularFirestore,
    private novels: NovelService,
    private hs: HistoryService
  ) { }

  ngOnDestroy() {
    this.end.next();
    this.end.complete();
  }

  get timestamp() {
    return firestore.FieldValue.serverTimestamp();
  }

  private pathCh(chapterID: string, novelID = this.query.novelID): string {
    return `${dbKeys.CNovels}/${novelID}/${dbKeys.CNovelsChapters}/${chapterID}`;
  }
  private pathStats(novelID = this.query.novelID): string {
    return `${dbKeys.CNovels}/${novelID}/${dbKeys.CStats}/${dbKeys.CNovelsChapters}`;
  }

  init(novelID: string, chapterID: string, opts?: Partial<ChaptersQuery>) {
    // Reset the data
    this._data.next([]);
    this._done.next(false);
    this._loading.next(false);
    this.novelID = novelID;
    this.query = {
      novelID,
      reverse: false,
      prepend: false,
      ...opts
    };
    this.cursor = chapterID;
    this.cursorPrev = chapterID;

    this.readToc$ = this.toc().pipe(
      map(toc => this.tocFilterPublic(toc)),  // We are only interested in PUBLIC chapter
      tap(() => this._done.next(false)),      // If changed, enable another try for additional chapters!
      shareReplay(1)
    );
    this.readToc$.pipe(
      takeUntil(this.end)                     // Unsubscribe when destroyed
    ).subscribe(toc => this.readToc = toc);

    this.mapAndUpdate(chapterID);
  }

  prev() {
    if (!this.readToc) {
      setTimeout(() => this.prev(), 250);
      return;
    }
    if (!this._loading.value) {
      this.query.prepend = true;

      const newCursor = this.prevChapterID(this.cursorPrev);
      if (newCursor) {// New values
        this.mapAndUpdate(newCursor);
      }
    }
  }

  more() {
    if (!this._done.value) {
      if (!this.readToc) {
        setTimeout(() => this.more(), 250);
        return;
      }

      this.query.prepend = false;
      const newCursor = this.nextChapterID(this.cursor);

      if (!newCursor) {// No more values, mark done
        this._done.next(true);
      } else {
        this.mapAndUpdate(newCursor);
      }
    }
  }

  prevChapterID(currentID: string): string {
    const chIndex = this.chapterID_to_index(this.readToc.toc, currentID);
    const index = this.readToc.indexes.indexOf(chIndex.toFixed(0)) - 1;

    if (index < 0) {
      return null;
    } else {
      const nextChapterIndex = this.readToc.indexes[index];
      return this.readToc.toc[nextChapterIndex].id;
    }
  }
  nextChapterID(currentID: string): string {
    const chIndex = this.chapterID_to_index(this.readToc.toc, currentID);
    const index = this.readToc.indexes.indexOf(chIndex.toFixed(0)) + 1;

    if (index >= this.readToc.indexes.length) {
      return null;
    } else {
      const nextChapterIndex = this.readToc.indexes[index];
      return this.readToc.toc[nextChapterIndex].id;
    }
  }

  // Maps the snapshot to usable format the updates source
  private mapAndUpdate(chapterID: string) {
    if (this._loading.value) { return; }

    const doc = this.afs.doc<Chapter>(this.pathCh(chapterID));

    // loading
    this._loading.next(true);

    // Map snapshot with doc ref (needed for cursor)
    return doc.valueChanges().pipe(
      tap(ch => {
        // Update source with new values, done loading
        // this._data.next([ch]);
        this._data.next(this.query.prepend ? [ch].concat(this._data.value) : this._data.value.concat(ch));
        this._loading.next(false);
        if (this.query.prepend) {
          this.cursorPrev = chapterID;
        } else {
          this.cursor = chapterID;
        }
      }),
      first()
    ).subscribe(
      () => null,
      (err) => console.error('mapAndUpdate:', err)
    );
  }

  state(novelID = this.novelID) {
    return this.afs.doc<ChaptersStats>(this.pathStats(novelID)).valueChanges();
  }

  toc(novelID = this.novelID): Observable<TOC> {
    this.novelID = novelID;
    this.readToc$ = this.tocAll(novelID).pipe(
      map(toc => this.tocFilterPublic(toc)),
      shareReplay(1)
    );
    this.readToc$.pipe(
      takeUntil(this.end)
    ).subscribe(toc => this.readToc = toc);
    return this.readToc$;
  }
  tocAll(novelID = this.novelID): Observable<TOC> {
    this.novelID = novelID;
    return this.afs.doc<ChaptersStats>(this.pathStats(novelID)).valueChanges().pipe(
      map(stats => {
        if (!stats) { return undefined; }
        return new TOC(Object.keys(stats.toc), stats.toc);
      })
    );
  }
  tocFilterPublic(toc: TOC): TOC {
    if (!toc) { return toc; }

    const indexes = toc.indexes.filter((i) => {
      return toc.toc[i].public;
    });
    toc.indexes = indexes;
    return toc;
  }
  tocCountPrivate(toc: TOC): number {
    let n = 0;
    for (const key in toc.indexes) {
      if (!toc.toc[key].public) {
        n++;
      }
    }
    return n;
  }

  chaptersReleaseRate(toc: TOC) {
    let rate = 0;
    const date = new Date();
    date.setDate(date.getDate() - 28);

    for (let i = toc.indexes.length - 1; i >= 0; i--) {
      const chDate = toc.toc[toc.indexes[i]].createdAt as firestore.Timestamp;
      if (chDate.toDate() >= date) {
        rate++;
      } else {
        break;
      }
    }
    return (rate / 4).toFixed(2);
  }

  chapterAdd(chapter: Chapter, novelID = this.novelID): Observable<void> {
    return this.afs.doc<ChaptersStats>(this.pathStats(novelID)).valueChanges().pipe(
      debounceTime(200),
      exhaustMap(stats => this.ensureNovelMetaExists(stats, novelID)),
      exhaustMap(stats => this.chapterSet(chapter, stats)),
      first()
    );
  }

  private ensureNovelMetaExists(stats: ChaptersStats, novelID: string = this.novelID): Observable<ChaptersStats> {
    if (stats && stats.novel) {
      return of<ChaptersStats>(stats);
    } else {
      return this.novels.novelGet(novelID).pipe(
        map(novel => new ChaptersStats({
          id: novel.id,
          title: novel.title
        }, novel.author))
      );
    }
  }
  private chapterSet(chapter: Chapter, stats: ChaptersStats) {
    const newChapterID = chapter.id || this.afs.createId();
    const chapterMeta: ChapterMeta = {
      id: newChapterID,
      title: chapter.title,
      createdAt: this.timestamp,
      public: chapter.public || false
    };

    let updateIndex: string;
    if (chapter.id && stats) {
      const indexes = Object.keys(stats.toc);
      for (const i in indexes) {
        if (stats.toc[i].id === chapter.id) {
          updateIndex = i;
          break;
        }
      }
    }

    // Get a new write batch
    const batch = this.afs.firestore.batch();

    // Create the chapter
    const chapterRef = this.afs.doc<Chapter>(this.pathCh(newChapterID, stats.novel.id)).ref;
    batch.set(chapterRef, {
      novel: stats.novel,
      author: stats.author,

      id: newChapterID,
      title: chapter.title,
      content: chapter.content,

      public: chapter.public || false,

      createdAt: this.timestamp,
      updatedAt: this.timestamp
    });

    // Update stats
    const statsRef = this.afs.doc<ChaptersStats>(this.pathStats(stats.novel.id)).ref;
    batch.set(statsRef, {
      updatedAt: this.timestamp,
      id: newChapterID,
      public: firestore.FieldValue.increment(chapter.public ? 1 : 0),
      private: firestore.FieldValue.increment(chapter.public ? 0 : 1),
      toc: {
        [updateIndex ? updateIndex : stats.nextIndex]: chapterMeta
      },
      nextIndex: firestore.FieldValue.increment(updateIndex ? 0 : 1)
    }, { merge: true });

    // Commit the batch
    return batch.commit();
  }

  chapterPublicToggle(chapterID: string, currentPublic: boolean, novelID: string = this.novelID): Observable<void> {
    return this.afs.doc<ChaptersStats>(this.pathStats(novelID)).valueChanges().pipe(
      exhaustMap(stats => {
        const toc = stats.toc;
        const index = this.chapterID_to_index(toc, chapterID);
        const ch = toc[index];

        const batch = this.afs.firestore.batch();
        const chapterRef = this.afs.doc<Chapter>(this.pathCh(chapterID, novelID)).ref;
        batch.update(chapterRef, {
          updatedAt: this.timestamp,
          public: !currentPublic
        });

        const statsRef = this.afs.doc<ChaptersStats>(this.pathStats(novelID)).ref;

        batch.update(statsRef, {
          id: chapterID,
          updatedAt: this.timestamp,
          public: firestore.FieldValue.increment(currentPublic ? -1 : 1),
          private: firestore.FieldValue.increment(currentPublic ? 1 : -1),
          toc: {
            ...toc,
            [index]: {
              id: ch.id,
              title: ch.title,
              createdAt: ch.createdAt,
              public: !currentPublic
            }
          }
        });

        return batch.commit();
      }),
      first()
    );
  }
  chapterRemove(chapterID: string, novelID: string = this.novelID): Observable<void> {
    return this.afs.doc<Chapter>(this.pathCh(chapterID, novelID)).valueChanges().pipe(
      exhaustMap(chapter => {
        const chapterMeta: ChapterMeta = {
          id: chapter.id,
          title: chapter.title,
          public: chapter.public
        };

        const batch = this.afs.firestore.batch();
        const chapterRef = this.afs.doc<Chapter>(this.pathCh(chapterID, novelID)).ref;
        batch.delete(chapterRef);

        const statsRef = this.afs.doc<ChaptersStats>(this.pathStats(novelID)).ref;
        if (chapter.public) {
          batch.update(statsRef, {
            updatedAt: this.timestamp,
            id: chapterID,
            public: firestore.FieldValue.arrayRemove(chapterMeta)
          });
        } else {
          batch.update(statsRef, {
            updatedAt: this.timestamp,
            id: chapterID,
            private: firestore.FieldValue.arrayRemove(chapterMeta),
          });
        }

        return batch.commit();
      }),
      first()
    );
  }

  chapterID_to_index(toc: ChaptersList, chapterID: string): number {
    const keys = Object.keys(toc);
    let index: string = null;

    for (const key in keys) {
      if (toc[key].id === chapterID) {
        index = key;
      }
    }

    return parseInt(index, 10);
  }

  switchChaptersIndexes(index1: string, index2: string, novelID: string = this.novelID) {
    const statsDoc = this.afs.doc<ChaptersStats>(this.pathStats(novelID));
    return statsDoc.valueChanges().pipe(
      exhaustMap(stats => {
        return statsDoc.update({
          toc: {
            ...stats.toc,
            [index1]: stats.toc[index2],
            [index2]: stats.toc[index1]
          },
          updatedAt: this.timestamp
        });
      }),
      first()
    );
  }


  readGet(novelID: string = this.novelID): Observable<HistoryNovel> {
    this.novelID = novelID;
    return this.hs.getMyHistory<HistoryNovel>(dbKeys.CHistoryNovels, novelID);
  }

  readSet(chapterID: string, read = false) {
    return this.afs.doc<ChaptersStats>(this.pathStats(this.novelID)).valueChanges().pipe(
      exhaustMap(stats => this.hs.setMyHistory<HistoryNovel>(dbKeys.CHistoryNovels, this.novelID, {
        novel: stats.novel,
        chapterID,
        index: this.chapterID_to_index(stats.toc, chapterID),
        read
      })),
      first()
    );
  }

}
