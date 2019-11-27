import { environment } from 'src/environments/environment.prod';
import { dbKeys, storageKeys } from 'src/app/keys.config';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable, BehaviorSubject } from 'rxjs';
import { firestore } from 'firebase/app';
import { Novel, NovelsStats } from 'src/app/shared/models/novels/novel.model';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { map, first, switchMap, tap, scan } from 'rxjs/operators';
import { UserService } from './user.service';
import { Genre } from 'src/app/shared/models/novels/genre.model';
import { LikesService } from './likes.service';
import { LikeStats, Like } from 'src/app/shared/models/like.model';
import { LibraryService } from './library.service';
import { PaginateCollectionService, QueryConfig } from './paginate-collection.service';

export interface NovelsQueryConfig {
  public: boolean;
  authorID?: string;
  sortField: 'iTitle' | 'createdAt' | 'updatedAt'; // field to orderBy
  limit: number; // limit per query
  reverse: boolean; // reverse order
  prepend: boolean; // prepend to source
}
@Injectable({
  providedIn: 'root'
})
export class NovelService extends PaginateCollectionService<Novel> {
// tslint:disable: variable-name
  private novelID: string;
// tslint:enable: variable-name

  constructor(
    afs: AngularFirestore,
    private afStorage: AngularFireStorage,
    private users: UserService,
    private ls: LikesService,
    private libs: LibraryService
  ) {
    super(afs);
  }

  init(opts?: Partial<QueryConfig>) {
    const path = dbKeys.C_NOVELS;

    const queryFunc = (ref: firestore.CollectionReference): firestore.Query => {
      let query: firestore.Query = ref;
      if (this.query.public) { query = query.where('public', '==', true); }
      if (this.query.authorID) { query = query.where('author.uid', '==', this.query.authorID); }

      if (this.query.genres && this.query.genres.length > 0) {
        query = query.where('genres', 'array-contains-any', this.query.genres);
      }
      return query;
    };
    super.doInit(path, opts, queryFunc);
    return null;
  }

  get timestamp() {
    return firestore.FieldValue.serverTimestamp();
  }

  novelGet(id: string): Observable<Novel> {
    this.novelID = id;

    return this.afs
      .collection<Novel>(dbKeys.C_NOVELS, ref => {
        return ref.where('public', '==', true);
      })
      .doc<Novel>(id)
      .valueChanges();
  }

  novelAdd(data: Novel): Observable<string> {
    return this.users.currentUser
      .pipe(
        first(),
        switchMap(user => {
          // Prepare new entries
          const newStoryId = this.afs.createId();
          const newNovel: Novel = {
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
          };
          const newStats: NovelsStats = {
            updatedAt: this.timestamp,
            n: firestore.FieldValue.increment(1),
            nAll: firestore.FieldValue.increment(data.public ? 1 : 0),
            id: newStoryId
          };

          // Get a new write batch
          const batch = this.afs.firestore.batch();
          const storyRef = this.afs.doc<Novel>(`${dbKeys.C_NOVELS}/${newStoryId}`).ref;
          const statsRef = this.afs.doc<NovelsStats>(`${dbKeys.C_NOVELS}/${dbKeys.STATS_DOC}`).ref;

          batch.set(storyRef, newNovel);
          batch.set(statsRef, newStats, { merge: true });

          // Commit the batch
          return batch.commit().then(
            () => newStoryId,
            (err) => Promise.reject(err)
          );
        })
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
    const path = `${dbKeys.C_NOVELS}/${id}`;
    return this.afs.doc<Novel>(path).update({
      updatedAt: this.timestamp,
      title,
      iTitle: this.caseFoldNormalize(title)
    });
  }

  novelDescriptionEdit(id: string, description: string) {
    const path = `${dbKeys.C_NOVELS}/${id}`;
    return this.afs.doc<Novel>(path).update({
      updatedAt: this.timestamp,
      description
    });
  }

  novelGenresEdit(id: string, genres: Genre[]) {
    const path = `${dbKeys.C_NOVELS}/${id}`;
    return this.afs.doc<Novel>(path).update({
      updatedAt: this.timestamp,
      genres
    });
  }

  novelPublicToggle(id: string, currentPublic: boolean) {
    // Prepare entries
    const upNovel: Partial<Novel> = {
      updatedAt: this.timestamp,
      public: !currentPublic
    };
    const upStats: NovelsStats = {
      id,
      updatedAt: this.timestamp,
      n: firestore.FieldValue.increment(currentPublic ? -1 : 1)
    };

    // Process batch write
    const batch = this.afs.firestore.batch();
    const refNovel = this.afs.doc<Novel>(`${dbKeys.C_NOVELS}/${id}`).ref;
    const refStats = this.afs.doc<NovelsStats>(`${dbKeys.C_NOVELS}/${dbKeys.STATS_DOC}`).ref;

    batch.update(refNovel, upNovel);
    batch.update(refStats, upStats);

    return batch.commit();
  }

  novelTagsEdit(id: string, overwriteTags: string[]) {
    const path = `${dbKeys.C_NOVELS}/${id}`;
    return this.afs.doc<Novel>(path).update({
      tags: overwriteTags,
      updatedAt: this.timestamp
    });
  }

  novelTagRemove(id: string, removeTag: string) {
    const path = `${dbKeys.C_NOVELS}/${id}`;
    return this.afs.doc<Novel>(path).update({
      tags: firestore.FieldValue.arrayRemove(removeTag),
      updatedAt: this.timestamp
    });
  }

  novelRemove(id: string, currentPublic: boolean): Promise<void> {
    // Prepare updated entries
    const upStats: NovelsStats = {
      updatedAt: this.timestamp,
      id,
      n: firestore.FieldValue.increment(currentPublic ? -1 : 0),
      nAll: firestore.FieldValue.increment(-1),
      nDeleted: firestore.FieldValue.increment(1)
    };

    // Process batch write
    const batch = this.afs.firestore.batch();
    const refNovel = this.afs.doc<Novel>(`${dbKeys.C_NOVELS}/${id}`).ref;
    const refStats = this.afs.doc<NovelsStats>(`${dbKeys.C_NOVELS}/${dbKeys.STATS_DOC}`).ref;

    batch.delete(refNovel);
    batch.set(refStats, upStats);

    return batch.commit();
  }
/*
  filterByTags(novels: Novels[]): Novels[] {
    return novels.filter()
  }
*/
  private caseFoldNormalize(value: string) {
    return value.normalize('NFKC').toLowerCase().toLowerCase();
  }

  // LIKE/DISLIKE SYSTEM
  like(): Observable<void> {
    const path = `${dbKeys.C_NOVELS}/${this.novelID}`;
    return this.ls.like(path);
  }
  dislike(): Observable<void> {
    const path = `${dbKeys.C_NOVELS}/${this.novelID}`;
    return this.ls.dislike(path);
  }
  unlike(): Observable<void> {
    const path = `${dbKeys.C_NOVELS}/${this.novelID}`;
    return this.ls.reset(path);
  }
  getLikes(): Observable<LikeStats> {
    const path = `${dbKeys.C_NOVELS}/${this.novelID}`;
    return this.ls.stats(path);
  }
  likeState(): Observable<Like> {
    const path = `${dbKeys.C_NOVELS}/${this.novelID}`;
    return this.ls.state(path);
  }

  // LIBRARY SYSTEM
  libNovels(uid: string) {
    return this.libs.libraryField(uid, dbKeys.C_library_novels);
  }
  libMyNovels() {
    return this.libs.myLibraryField(dbKeys.C_library_novels);
  }
  inLibrary(novelID: string) {
    return this.libs.inLibrary(dbKeys.C_library_novels, novelID);
  }
  libAdd(novelID: string) {
    return this.libs.add(dbKeys.C_library_novels, novelID);
  }
  libRemove(novelID: string) {
    return this.libs.remove(dbKeys.C_library_novels, novelID);
  }
}
