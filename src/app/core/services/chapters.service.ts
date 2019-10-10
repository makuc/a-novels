import { dbKeys } from 'src/app/keys.config';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import { Novel } from 'src/app/shared/models/novels/novel.model';
import { first, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { Chapter, ChapterMeta } from 'src/app/shared/models/novels/chapter.model';
import { NovelsStats } from 'src/app/shared/models/novels/novels-stats.model';
import { NovelService } from './novel.service';
import { ChaptersStats } from 'src/app/shared/models/novels/chapters-stats.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChaptersService {
// tslint:disable: variable-name
  private _novels: AngularFirestoreCollection<Novel>;
// tslint:enable: variable-name

  constructor(
    private afStore: AngularFirestore,
    private novels: NovelService
  ) {
    this._novels = this.afStore.collection<Novel>(dbKeys.COLLECTION_NOVELS);
  }

  get timestamp() {
    return firestore.FieldValue.serverTimestamp();
  }

  private chColl(novelID: string) {
    return this.afStore
      .collection<Novel>(dbKeys.COLLECTION_NOVELS)
      .doc<Novel>(novelID)
      .collection<Chapter>(dbKeys.COLLECTION_NOVELS_CHAPTERS);
  }

  chapterAdd(novelID: string, chapter: Chapter): Observable<string> {
    return this.novels.novelGet(novelID)
      .pipe(
        first(),
        switchMap(novel => {
          const newChapterId = this.afStore.createId();
          const chapterMeta: ChapterMeta = {
            id: newChapterId,
            title: chapter.title
          };
          // Get a new write batch
          const batch = this.afStore.firestore.batch();

          console.log('Novel:', {
            title: novel.title,
            id: novel.id
          });

          const chapterRef = this.chColl(novel.id).doc(newChapterId).ref;
          batch.set(chapterRef, {
            novel: {
              id: novel.id,
              title: novel.title
            },
            author: novel.author,

            id: newChapterId,
            title: chapter.title,
            content: chapter.content,

            public: chapter.public || false,

            createdAt: this.timestamp,
            updatedAt: this.timestamp
          });

          const statsRef = this.chColl(novel.id).doc<NovelsStats>(dbKeys.STATS_DOC).ref;
          if (chapter.public) {
            console.log('Add public ch');
            batch.set(statsRef, {
              updatedAt: this.timestamp,
              id: newChapterId,
              public: firestore.FieldValue.arrayUnion(chapterMeta),
            }, { merge: true });
          } else {
            console.log('Add private ch');
            batch.set(statsRef, {
              updatedAt: this.timestamp,
              id: newChapterId,
              private: firestore.FieldValue.arrayUnion(chapterMeta)
            }, { merge: true });
          }


          // Commit the batch
          return batch.commit()
            .then(
              (val) => {
                console.log('Success:', newChapterId);
                return newChapterId;
              },
              (err) => {
                console.log('Error adding chapter:', err);
                return Promise.reject(err);
              }
            );
        })
      );
  }

  chapterTitleEdit(novelID: string, chapterID: string, title: string) {
    return this.chColl(novelID)
      .doc<Chapter>(chapterID)
      .update({
        updatedAt: this.timestamp,
        title,
      });
  }
  chapterContentEdit(novelID: string, chapterID: string, content: string) {
    return this.chColl(novelID)
      .doc<Chapter>(chapterID)
      .update({
        updatedAt: this.timestamp,
        content
      });
  }
  chapterPublicToggle(novelID: string, chapterID: string, currentPublic: boolean) {
    return this.chColl(novelID)
      .doc<Chapter>(chapterID)
      .valueChanges()
      .pipe(
        switchMap(chapter => {
          const chapterMeta: ChapterMeta = {
            id: chapter.id,
            title: chapter.title
          };

          const batch = this.afStore.firestore.batch();
          const chapterRef = this.chColl(novelID).doc<Chapter>(chapterID).ref;
          batch.update(chapterRef, {
            updatedAt: this.timestamp,
            public: !currentPublic
          });

          const statsRef = this.chColl(novelID).doc<ChaptersStats>(dbKeys.STATS_DOC).ref;
          if (currentPublic) {
            batch.update(statsRef, {
              id: chapterID,
              updatedAt: this.timestamp,
              public: firestore.FieldValue.arrayRemove(chapterMeta),
              private: firestore.FieldValue.arrayUnion(chapterMeta)
            });
          } else {
            batch.update(statsRef, {
              id: chapterID,
              updatedAt: this.timestamp,
              public: firestore.FieldValue.arrayUnion(chapterMeta),
              private: firestore.FieldValue.arrayRemove(chapterMeta)
            });
          }

          return batch.commit();
        })
      )
      .toPromise();
  }
  chapterRemove(novelID: string, chapterID: string): Promise<void> {
    return this.chColl(novelID)
      .doc<Chapter>(chapterID)
      .valueChanges()
      .pipe(
        switchMap(chapter => {
          const chapterMeta: ChapterMeta = {
            id: chapter.id,
            title: chapter.title
          };

          const batch = this.afStore.firestore.batch();
          const chapterRef = this.chColl(novelID).doc<Chapter>(chapterID).ref;
          batch.delete(chapterRef);

          const statsRef = this.chColl(novelID).doc<ChaptersStats>(dbKeys.STATS_DOC).ref;
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
      )
      .toPromise();
  }

}
