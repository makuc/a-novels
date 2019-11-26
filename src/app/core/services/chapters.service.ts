import { dbKeys } from 'src/app/keys.config';
import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import { Novel, NovelMeta } from 'src/app/shared/models/novels/novel.model';
import { first, switchMap, map, scan, tap, takeUntil } from 'rxjs/operators';
import { Chapter, ChapterMeta } from 'src/app/shared/models/novels/chapter.model';
import { NovelService } from './novel.service';
import { ChaptersStats, ChaptersList, TOC } from 'src/app/shared/models/novels/chapters-stats.model';
import { Observable, of, BehaviorSubject, Subject } from 'rxjs';
import { HistoryService } from './history.service';
import { HistoryNovel } from 'src/app/shared/models/history/history.model';
import { stringToKeyValue } from '@angular/flex-layout/extended/typings/style/style-transforms';

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

  private activeChapterID: string;
  private query: ChaptersQuery;
  private cursor: string;
  private cursorPrev: string;
// tslint:disable: variable-name
  private _done = new BehaviorSubject(false);
  private _loading = new BehaviorSubject(false);
  private _data = new BehaviorSubject<Chapter[]>([]);
// tslint:enable: variable-name

  // Observable data
  data: Observable<Chapter[]>;
  done: Observable<boolean> = this._done.asObservable();
  loading: Observable<boolean> = this._loading.asObservable();
  readToc: TOC;

  constructor(
    private afs: AngularFirestore,
    private novels: NovelService,
    private hs: HistoryService
  ) {
    console.log('Switch novelID and chapterID in func def');
  }

  ngOnDestroy() {
    this.end.next();
    this.end.complete();
  }

  get timestamp() {
    return firestore.FieldValue.serverTimestamp();
  }

  private ch(chapterID: string, novelID = this.query.novelID) {
    return this.afs.doc<Chapter>(`${dbKeys.C_NOVELS}/${novelID}/${dbKeys.C_NOVELS_CHAPTERS}/${chapterID}`);
  }
  private stats(novelID = this.query.novelID) {
    return this.afs.doc<ChaptersStats>(`${dbKeys.C_NOVELS}/${novelID}/${dbKeys.C_STATS}/${dbKeys.C_NOVELS_CHAPTERS}`);
  }

  init(novelID: string, chapterID: string, opts?: Partial<ChaptersQuery>) {
    // Reset the data
    this._data.next([]);
    this._done.next(false);
    this._loading.next(false);
    this.query = {
      novelID,
      reverse: false,
      prepend: false,
      ...opts
    };
    this.cursor = chapterID;
    this.cursorPrev = chapterID;

    this.toc().pipe(
      map(toc => this.tocFilterPublic(toc)),  // We are only interested in PUBLIC chapter
      tap(() => this._done.next(false)),      // If changed, enable another try for additional chapters!
      takeUntil(this.end)                     // Unsubscribe when destroyed
    ).subscribe(toc => this.readToc = toc);

    this.mapAndUpdate(chapterID);

    // Create the Observable array for consumption in components
    if (!this.data) {
      this.data = this._data.asObservable().pipe(
        scan( (acc, val) => this.query.prepend ? val.concat(acc) : acc.concat(val))
      );
    }
  }

  prev() {
    if (!this.readToc) {
      setTimeout(() => {
        this.prev();
      }, 250);
      return;
    }
    this.query.prepend = true;

    const newCursor = this.prevChapterID(this.cursorPrev);

    if (newCursor) {// New values
      this.mapAndUpdate(newCursor);
    }
  }
  more() {
    if (!this._done.value) {
      if (!this.readToc) {
        setTimeout(() => {
          this.more();
        }, 250);
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
    if (this._done.value || this._loading.value) { return; }

    const doc = this.ch(chapterID);

    // loading
    this._loading.next(true);

    // Map snapshot with doc ref (needed for cursor)
    return doc.valueChanges().pipe(
      tap(ch => {
        // Update source with new values, done loading
        this._data.next([ch]);
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

  state(novelID = this.query.novelID) {
    return this.stats(novelID).valueChanges();
  }

  toc(novelID = this.query.novelID): Observable<TOC> {
    return this.tocAll(novelID).pipe(
      map(toc => this.tocFilterPublic(toc))
    );
  }
  tocAll(novelID = this.query.novelID): Observable<TOC> {
    return this.stats(novelID).valueChanges().pipe(
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
  chapterAddTransactional(chapter: Chapter, novelID = this.query.novelID) {
    // Prepare working data
    const chMeta: ChapterMeta = {
      id: chapter.id || this.afs.createId(),
      title: chapter.title,
      public: chapter.public,
      createdAt: this.timestamp
    };

    // Create needed references
    const novelRef = this.afs.doc<Novel>(`${dbKeys.C_NOVELS}/${novelID}`).ref;
    const statsRef = this.stats(novelID).ref;
    const chapterRef = this.ch(chMeta.id, novelID).ref;

    // Execute the transaction
    return this.afs.firestore.runTransaction(transaction => {
      return Promise.all([ transaction.get(statsRef), transaction.get(chapterRef) ]).then(
        (docs) => {
          const stats = docs[0];
          const ch = docs[1];

          if (!stats.exists) {
            return transaction
              .get(novelRef)
              .then<TmpChStats>(novel => {
                const n = novel.data() as Novel;
                transaction.update(novelRef, {
                  updatedAt: this.timestamp
                });

                const nMeta: NovelMeta = {
                  id: n.id,
                  title: n.title
                };
                return {
                  stats: new ChaptersStats(nMeta, n.author),
                  chapter: ch.data() as Chapter
                };
              });
          } else {
            return {
              stats: stats.data() as ChaptersStats,
              chapter: ch.data() as Chapter
            };
          }
        }
      )
      .then(tmpChStats => {
        // Create the chapter
        transaction.set(chapterRef, {
          novel: tmpChStats.stats.novel,
          author: tmpChStats.stats.author,

          id: chMeta.id,
          title: chapter.title,
          content: chapter.content,

          public: chapter.public || false,

          createdAt: tmpChStats.chapter.createdAt || this.timestamp,
          updatedAt: this.timestamp
        }, { merge: true });

        // Increase number of private/public chapter?
        let publicInc = 0;
        let privateInc = 0;
        if (tmpChStats.chapter && tmpChStats.chapter.public) {
          if (tmpChStats.chapter.public === chapter.public) {
            publicInc = 0;
            privateInc = 0;
          } else {
            publicInc = chapter.public ? 1 : -1;
            privateInc = chapter.public ? -1 : 1;
          }
        } else {
          publicInc = chapter.public ? 1 : 0;
          privateInc = chapter.public ? 0 : 1;
        }

        // Try to get Index
        const index = this.chapterID_to_index(tmpChStats.stats.toc, chMeta.id);

        // Update stats
        transaction.set(statsRef, {
          novel: tmpChStats.stats.novel,
          author: tmpChStats.stats.author,

          updatedAt: this.timestamp,
          id: chMeta.id,

          public: firestore.FieldValue.increment(publicInc),
          private: firestore.FieldValue.increment(privateInc),

          toc: {
            [index ? index : tmpChStats.stats.nextIndex]: chMeta
          },
          nextIndex: firestore.FieldValue.increment(1)
        }, { merge: true });
      });
    });
  }
  chapterAdd(chapter: Chapter, novelID = this.query.novelID): Observable<void> {
    return this.stats(novelID)
      .valueChanges()
      .pipe(
        first(),
        switchMap(stats => this.ensureNovelMetaExists(novelID, stats)),
        switchMap(stats => this.chapterSet(chapter, stats))
      );
  }
  private ensureNovelMetaExists(novelID: string, stats: ChaptersStats): Observable<ChaptersStats> {
    if (stats && stats.novel) {
      return of<ChaptersStats>(stats);
    } else {
      return this.novels
        .novelGet(novelID)
        .pipe(
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
      public: chapter.public
    };
    // Get a new write batch
    const batch = this.afs.firestore.batch();

    // Create the chapter
    const chapterRef = this.ch(newChapterID, stats.novel.id).ref;
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
    const statsRef = this.stats(stats.novel.id).ref;
    batch.set(statsRef, {
      updatedAt: this.timestamp,
      id: newChapterID,
      public: firestore.FieldValue.increment(chapter.public ? 1 : 0),
      private: firestore.FieldValue.increment(chapter.public ? 0 : 1),
      toc: {
        [stats.nextIndex]: chapterMeta
      },
      nextIndex: firestore.FieldValue.increment(1)
    }, { merge: true });

    // Commit the batch
    return batch.commit();
  }

  chapterPublicToggle(novelID: string, chapterID: string, currentPublic: boolean): Observable<void> {
    return this.stats(novelID).valueChanges().pipe(
      first(),
      switchMap(stats => {
        const toc = stats.toc;
        const index = this.chapterID_to_index(toc, chapterID);
        const ch = toc[index];

        const batch = this.afs.firestore.batch();
        const chapterRef = this.ch(chapterID, novelID).ref;
        batch.update(chapterRef, {
          updatedAt: this.timestamp,
          public: !currentPublic
        });

        const statsRef = this.stats(novelID).ref;

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
      })
    );
  }
  chapterRemove(novelID: string, chapterID: string): Observable<void> {
    return this.ch(chapterID, novelID).valueChanges().pipe(
      first(),
      switchMap(chapter => {
        const chapterMeta: ChapterMeta = {
          id: chapter.id,
          title: chapter.title,
          public: chapter.public
        };

        const batch = this.afs.firestore.batch();
        const chapterRef = this.ch(chapterID, novelID).ref;
        batch.delete(chapterRef);

        const statsRef = this.stats(novelID).ref;
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
            private: firestore.FieldValue.arrayRemove(chapterMeta)
          });
        }

        return batch.commit();
      })
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

  switchChaptersIndexes(novelID: string, index1: string, index2: string) {
    return this.stats(novelID).valueChanges().pipe(
      first(),
      switchMap(stats => {
        return this.stats(novelID).update({
          toc: {
            ...stats.toc,
            [index1]: stats.toc[index2],
            [index2]: stats.toc[index1]
          },
          updatedAt: this.timestamp
        });
      })
    );
  }


  readGet(novelID: string): Observable<HistoryNovel> {
    return this.hs.getMyHistory<HistoryNovel>(dbKeys.C_history_novels, novelID);
  }

  readSet(chapterID: string, read = false) {
    this.activeChapterID = chapterID;

    return this.stats(this.query.novelID).valueChanges().pipe(
      first(),
      switchMap(stats => this.hs.setMyHistory<HistoryNovel>(dbKeys.C_history_novels, this.query.novelID, {
        novel: stats.novel,
        chapterID,
        index: this.chapterID_to_index(stats.toc, chapterID),
        read
      }))
    );
  }

}
