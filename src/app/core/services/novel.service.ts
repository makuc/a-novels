import { dbKeys, storageKeys } from 'src/app/keys.config';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, DocumentChangeAction, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { firestore } from 'firebase/app';
import { Novel, NovelMeta } from 'src/app/shared/models/novels/novel.model';
import { UserMeta, UserProfile } from 'src/app/shared/models/user-profile.model';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { map, first } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { Chapter } from 'src/app/shared/models/novels/chapter.model';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class NovelService {
// tslint:disable: variable-name
  private _novels: AngularFirestoreCollection<Novel>;
// tslint:enable: variable-name

  constructor(
    private afStore: AngularFirestore,
    private afStorage: AngularFireStorage,
    private users: UserService
  ) {
    this._novels = this.afStore.collection(dbKeys.COLLECTION_NOVELS);
  }

  get timestamp() {
    return firestore.FieldValue.serverTimestamp();
  }

  getNovel(id: string): Observable<Novel> {
    return this._novels.doc<Novel>(id)
      .snapshotChanges()
      .pipe(
        map(data => {
          const novel = data.payload.data() as Novel;
          const docId = data.payload.id;

          return novel;
        })
      );
  }

  getNovels(lastNovel: Novel = null, limit: number = 5): Observable<Novel[]> {
    if (lastNovel) {
      return this.afStore
        .collection<Novel>(dbKeys.COLLECTION_NOVELS, ref => (
          ref
            .orderBy('title')
            .startAfter(lastNovel.title)
            .limit(limit)
        ))
        .valueChanges();
    } else {
      return this.afStore
        .collection<Novel>(dbKeys.COLLECTION_NOVELS, ref => (
          ref
            .orderBy('title')
            .limit(limit)
        ))
        .valueChanges();
    }
  }
  getNovelsPrev(firstNovel: Novel = null, limit: number = 5): Observable<Novel[]> {
    if (firstNovel) {
      return this.afStore
        .collection<Novel>(dbKeys.COLLECTION_NOVELS, ref => (
          ref
            .orderBy('title')
            .endBefore(firstNovel.title)
            .limit(limit)
        ))
        .valueChanges();
    } else {
      const last = this.afStore
        .collection<Novel>(dbKeys.COLLECTION_NOVELS, ref => (
          ref
            .orderBy('title', 'desc')
            .limit(1)
        )).get().toPromise().then(
          snapshot => {

          },
          err => {
            if (!environment.production) {
              console.error('NovelsService.getNovelsPrev: get last novel in collection: ', err);
            }
          }
        )
      return this.afStore
        .collection<Novel>(dbKeys.COLLECTION_NOVELS, ref => (
          ref
            .orderBy('title', 'desc')
            .endBefore(last)
            .limit(limit)
        ))
        .valueChanges();
    }
  }

  getNovelsBy(uid: string): Observable<Novel[]> {
    return this.afStore.collection<Novel>(dbKeys.COLLECTION_NOVELS, ref => ref.where('author.uid', '==', uid)).valueChanges();
  }

  getNovelsBySnapshot(uid: string): Observable<Novel[]> {
    return this.afStore.collection<Novel>(dbKeys.COLLECTION_NOVELS, ref => ref.where('author.uid', '==', uid))
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data() as Novel;
          const id = a.payload.doc.id;

          return data;
        }))
      );
  }

  addNovel(data: Novel, author?: UserMeta): Promise<string> {
    if (author) {
      const id = this.afStore.createId();
      return this._novels.doc(id)
        .set({
          id,
          author,
          title: data.title,
          description: data.description,
          genres: data.genres,
          tags: data.tags,

          cover: false,
          published: data.published || false,

          createdAt: this.timestamp,
        })
        .then(
          () => id,
          (err) => err
        );
    } else {
      return this.users.currentUser
        .pipe(
          first()
        )
        .toPromise()
        .then(
          (user: UserProfile) => {
            return this.addNovel(data, {
              uid: user.uid,
              displayName: user.displayName
            });
          },
          (err) => err
        );
    }
  }

  uploadCover(id: string, img: File): AngularFireUploadTask {
    const path = `${storageKeys.NOVELS_COVER_PATH}/${id}/${storageKeys.NOVELS_COVER_ORIGINAL}`;
    console.log('Path:', path);
    return this.afStorage.upload(path, img);
  }

  updateNovel(id: string, data: any) {
    this._novels.doc(id).update({
      ...data,
      updatedAt: this.timestamp
    });
  }

  removeNovel(id: string): Promise<void> {
    const batch = this.afStore.firestore.batch();

    const novel = this.afStore.doc<Novel>(id);

    return batch.commit();
  }
/*
  filterByTags(novels: Novels[]): Novels[] {
    return novels.filter()
  }
*/

  // Chapters management here!!

  /**
   * Get chapters of a novel!
   * @param novelId Id of the novel's chapters requested
   */
  getChapters(novelId: string) {
    return this._novels
      .doc<Novel>(novelId)
      .valueChanges();
  }
  addChapter(novelMeta: NovelMeta, chapter: Chapter) {
    const id = this.afStore.createId();
    return this._novels
      .doc<Novel>(novelMeta.id)
      .collection(dbKeys.COLLECTION_NOVELS_CHAPTERS)
      .doc<Chapter>(id)
      .set({
        id,
        novel: novelMeta,

        title: chapter.title,
        chapter: chapter.chapter,

        createdAt: this.timestamp
      })
      .then(
        () => id,
        (err) => err
      );
  }
  updateChapter(novelId: string, chapterId, chapter: Chapter) {
    return this._novels
      .doc<Novel>(novelId)
      .collection(dbKeys.COLLECTION_NOVELS_CHAPTERS)
      .doc<Chapter>(chapterId)
      .update({
        title: chapter.title,
        chapter: chapter.chapter,

        updatedAt: this.timestamp
      });
  }
}
