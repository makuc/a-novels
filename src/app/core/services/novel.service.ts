import { dbKeys, storageKeys } from 'src/app/keys.config';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference, DocumentChangeAction, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { firestore } from 'firebase/app';
import { Novel, NovelMeta } from 'src/app/shared/models/novels/novel.model';
import { UserMeta, UserProfile } from 'src/app/shared/models/users/user-profile.model';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { map, first, switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';
import { Chapter } from 'src/app/shared/models/novels/chapter.model';
import { UserService } from './user.service';
import { NovelsStats } from 'src/app/shared/models/novels/novels-stats.model';
import { Genre } from 'src/app/shared/models/novels/genre.model';

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
    this._novels = this.afStore.collection<Novel>(dbKeys.COLLECTION_NOVELS);
  }

  get timestamp() {
    return firestore.FieldValue.serverTimestamp();
  }

  novelGet(id: string): Observable<Novel> {
    return this.afStore
      .collection<Novel>(dbKeys.COLLECTION_NOVELS, ref => (
        ref
          .where('public', '==', true)
      ))
      .doc<Novel>(id)
      .snapshotChanges()
      .pipe(
        map(data => {
          const novel = data.payload.data() as Novel;
          const docId = data.payload.id;

          return novel;
        })
      );
  }

  novelsGet(lastNovel: Novel = null, limit: number = 5): Observable<Novel[]> {
    /*if (lastNovel) {
      return this.afStore
        .collection<Novel>(dbKeys.COLLECTION_NOVELS, ref => (
          ref
            .orderBy('title')
            .startAfter(lastNovel.title)
            .limit(limit)
        ))
        .valueChanges();
    } else {*/
      console.log('Really?');
      return this.afStore
        .collection<Novel>(dbKeys.COLLECTION_NOVELS, ref => ref
          .orderBy('title', 'asc')
          .where('public', '==', true)

          // .limit(limit)
        )
        .valueChanges();
    // }
  }

  novelsGetBy(uid: string): Observable<Novel[]> {
    return this.afStore.collection<Novel>(dbKeys.COLLECTION_NOVELS, ref => ref.where('author.uid', '==', uid)).valueChanges();
  }

  novelsGetSnapshotsBy(uid: string): Observable<Novel[]> {
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

  novelAdd(data: Novel): Observable<string> {
    return this.users.currentUser
      .pipe(
        first(),
        switchMap(
          user => {
            // Get a new write batch
            const batch = this.afStore.firestore.batch();

            const newStoryId = this.afStore.createId();
            const storyRef = this._novels.doc(newStoryId).ref;
            batch.set(storyRef, {
              id: newStoryId,
              author: {
                uid: user.uid,
                displayName: user.displayName
              },

              title: data.title,
              iTitle: this.caseFoldNormalize(data.title),

              description: data.description,
              genres: data.genres,
              tags: data.tags,

              cover: false,
              public: data.public || false,

              createdAt: this.timestamp,
              updatedAt: this.timestamp
            });

            const statsRef = this._novels.doc<NovelsStats>(dbKeys.STATS_DOC).ref;
            batch.set(statsRef, {
              updatedAt: this.timestamp,
              n: firestore.FieldValue.increment(1),
              nAll: firestore.FieldValue.increment(data.public ? 1 : 0),
              id: newStoryId
            }, { merge: true });

            // Commit the batch
            return batch.commit()
              .then(
                (val) => newStoryId,
                (err) => Promise.reject(err)
              );
          }
        )
      );
  }
  novelCoverUpload(id: string, img: File): AngularFireUploadTask {
    const path = `${storageKeys.NOVELS_COVER_PATH}/${id}/${storageKeys.NOVELS_COVER_ORIGINAL}`;
    return this.afStorage.upload(path, img);
  }
  novelCoverRemove(id: string) {
    const path = `${storageKeys.NOVELS_COVER_PATH}/${id}/${storageKeys.NOVELS_COVER_ORIGINAL}`;
    return this.afStorage.ref(path).delete().toPromise();
  }
  novelTitleEdit(id: string, title: string) {
    return this._novels.doc<Novel>(id).update({
      updatedAt: this.timestamp,
      title,
      iTitle: this.caseFoldNormalize(title)
    });
  }
  novelDescriptionEdit(id: string, description: string) {
    return this._novels.doc<Novel>(id).update({
      updatedAt: this.timestamp,
      description
    });
  }
  novelGenresEdit(id: string, genres: Genre[]) {
    return this._novels.doc<Novel>(id).update({
      updatedAt: this.timestamp,
      genres
    });
  }
  novelPublicToggle(id: string, currentPublic: boolean) {
    const batch = this.afStore.firestore.batch();

    const novelRef = this._novels.doc<Novel>(id).ref;
    batch.update(novelRef, {
      updatedAt: this.timestamp,
      public: !currentPublic
    });

    const statsRef = this._novels.doc<NovelsStats>(dbKeys.STATS_DOC).ref;
    batch.update(statsRef, {
      id,
      updatedAt: this.timestamp,
      n: firestore.FieldValue.increment(currentPublic ? -1 : 1)
    });

    return batch.commit();
  }
  novelTagsEdit(id: string, overwriteTags: string[]) {
    return this._novels.doc<Novel>(id).update({
      tags: overwriteTags,
      updatedAt: this.timestamp
    });
  }
  novelTagRemove(id: string, removeTag: string) {
    return this._novels.doc<Novel>(id).update({
      tags: firestore.FieldValue.arrayRemove(removeTag),
      updatedAt: this.timestamp
    });
  }

  novelRemove(id: string, currentPublic: boolean): Promise<void> {
    const batch = this.afStore.firestore.batch();

    const novelRef = this.afStore.doc<Novel>(id).ref;
    batch.delete(novelRef);

    const statsRef = this.afStore.doc<NovelsStats>(dbKeys.STATS_DOC).ref;
    batch.set(statsRef, {
      updatedAt: this.timestamp,
      id,
      n: firestore.FieldValue.increment(currentPublic ? -1 : 0),
      nAll: firestore.FieldValue.increment(-1),
      nDeleted: firestore.FieldValue.increment(1)
    });

    return batch.commit();
  }
/*
  filterByTags(novels: Novels[]): Novels[] {
    return novels.filter()
  }
*/
  private caseFoldNormalize(value: string) {
    return value.normalize('NFKC').toLowerCase().toUpperCase().toLowerCase();
  }
}
