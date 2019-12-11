import { dbKeys, storageKeys } from 'src/app/keys.config';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, throwError, of } from 'rxjs';
import { firestore } from 'firebase/app';
import { Novel, NovelsStats } from 'src/app/shared/models/novels/novel.model';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Genre } from 'src/app/shared/models/novels/genre.model';
import { LikesService } from './likes.service';
import { LikeStats, Like } from 'src/app/shared/models/like.model';
import { LibraryService } from './library.service';
import { PaginateCollectionService, QueryConfig } from './paginate-collection.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { map, catchError, mergeMap, concatMap } from 'rxjs/operators';

export interface NovelsQueryConfig extends QueryConfig {
  public: boolean;
  authorID?: string;
  genres?: Genre[];
  sortField: 'iTitle' | 'createdAt' | 'updatedAt'; // field to orderBy, override
}

@Injectable({
  providedIn: 'root'
})
export class NovelService extends PaginateCollectionService<Novel> {

  // Additional Query Settings
  private authorID: string;
  private public = true;
  private genres: Genre[];

  // Handy Helper (like, library, etc.)
  private novelID: string;

  constructor(
    afs: AngularFirestore,
    private afStorage: AngularFireStorage,
    private auth: AuthenticationService,
    private ls: LikesService,
    private libs: LibraryService
  ) {
    super(afs);
  }

  private get user() {
    return this.auth.currentSnapshot;
  }

  init(opts?: Partial<NovelsQueryConfig>) {
    const path = dbKeys.CNovels;
    this.authorID = opts.authorID;
    this.public = opts.public === false ? (this.user && this.user.uid === this.authorID) : true;
    this.genres = opts.genres;

    super.doInit(path, opts, (ref) => this.queryFn(ref));
    return null;
  }

  private queryFn(ref: firestore.CollectionReference): firestore.Query {
    let query: firestore.Query = ref;
    if (this.authorID) { query = query.where('author.uid', '==', this.authorID); }
    if (this.public) { query = query.where('public', '==', true); }
    if (this.genres && this.genres.length > 0) {
      query = query.where('genres', 'array-contains-any', this.genres);
    }
    return query;
  }


  // NOVELS MANAGEMENT
  private get timestamp() {
    return firestore.FieldValue.serverTimestamp();
  }

  novelGet(id: string): Observable<Novel> {
    this.novelID = id;
    const path = `${dbKeys.CNovels}/${id}`;
    return this.afs.doc<Novel>(path).valueChanges()/*.pipe(
      concatMap(novel => this.coverThumbURL(novel.coverID).pipe( map(url => this.mapCoverThumb(novel, url)) )),
      concatMap(novel => this.coverFullURL(novel.coverID).pipe( map(url => this.mapCoverFull(novel, url)) ))
    )*/;
  }

  private mapCoverThumb(novel: Novel, url: string) {
    console.log('thumb url:', url);
    const updated: Novel = {
      ...novel,
      coverThumbURL: url
    };
    return updated;
  }
  private mapCoverFull(novel: Novel, url: string) {
    console.log('thumb url:', url);
    const updated: Novel = {
      ...novel,
      coverFullURL: url
    };
    return updated;
  }
  coverThumbURL(coverID: string): Observable<string> {
    const path = `${storageKeys.NovelsPath}/${coverID}/${storageKeys.NovelsCoverThumb}`;
    return this.afStorage.ref(path).getDownloadURL();
  }
  coverFullURL(coverID: string): Observable<string> {
    const path = `${storageKeys.NovelsPath}/${coverID}/${storageKeys.NovelsCoverFull}`;
    return this.afStorage.ref(path).getDownloadURL();
  }

  novelAdd(data: Novel): Promise<string> {
    if (!this.user) { return this.rejectLoginPromise; }

    // Prepare new entries
    const newStoryId = this.afs.createId();
    const newNovel: Novel = {
      id: newStoryId,
      author: {
        uid: this.user.uid,
        displayName: this.user.displayName
      },

      title: data.title,
      iTitle: this.caseFoldNormalize(data.title),

      description: data.description,
      genres: data.genres,
      tags: data.tags,

      coverThumbURL: storageKeys.DefaultNovelsCoverThumb,
      coverFullURL: storageKeys.DefaultNovelsCoverFull,
      public: data.public || false,

      createdAt: this.timestamp,
      updatedAt: this.timestamp
    };
    const newStats: NovelsStats = {
      updatedAt: this.timestamp,
      n: firestore.FieldValue.increment(data.public ? 1 : 0),
      nAll: firestore.FieldValue.increment(1),
      id: newStoryId
    };

    // Get a new write batch
    const batch = this.afs.firestore.batch();
    const storyRef = this.afs.doc<Novel>(`${dbKeys.CNovels}/${newStoryId}`).ref;
    const statsRef = this.afs.doc<NovelsStats>(`${dbKeys.CNovels}/${dbKeys.STATS_DOC}`).ref;

    batch.set(storyRef, newNovel);
    batch.set(statsRef, newStats, { merge: true });

    // Commit the batch
    return batch.commit().then(
      () => newStoryId
    );
  }

  novelCoverUpload(id: string, img: File): AngularFireUploadTask {
    const path = `${storageKeys.NovelsPath}/${id}/${storageKeys.NovelsCoverOriginal}`;
    return this.afStorage.upload(path, img);
  }

  novelCoverRemove(id: string = this.novelID): Promise<void> {
    const path = `${dbKeys.CNovels}/${id}`;
    return this.afs.doc<Novel>(path).update({
      coverFullURL: storageKeys.DefaultNovelsCoverFull,
      coverThumbURL: storageKeys.DefaultNovelsCoverThumb
    });
  }

  novelTitleEdit(id: string, title: string) {
    const path = `${dbKeys.CNovels}/${id}`;
    return this.afs.doc<Novel>(path).update({
      updatedAt: this.timestamp,
      title,
      iTitle: this.caseFoldNormalize(title)
    });
  }

  novelDescriptionEdit(id: string, description: string) {
    const path = `${dbKeys.CNovels}/${id}`;
    return this.afs.doc<Novel>(path).update({
      updatedAt: this.timestamp,
      description
    });
  }

  novelGenresEdit(id: string, genres: Genre[]) {
    const path = `${dbKeys.CNovels}/${id}`;
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
    const refNovel = this.afs.doc<Novel>(`${dbKeys.CNovels}/${id}`).ref;
    const refStats = this.afs.doc<NovelsStats>(`${dbKeys.CNovels}/${dbKeys.STATS_DOC}`).ref;

    batch.update(refNovel, upNovel);
    batch.update(refStats, upStats);

    return batch.commit();
  }

  novelTagsEdit(id: string, overwriteTags: string[]) {
    const path = `${dbKeys.CNovels}/${id}`;
    return this.afs.doc<Novel>(path).update({
      tags: overwriteTags,
      updatedAt: this.timestamp
    });
  }

  novelTagRemove(id: string, removeTag: string) {
    const path = `${dbKeys.CNovels}/${id}`;
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
    const refNovel = this.afs.doc<Novel>(`${dbKeys.CNovels}/${id}`).ref;
    const refStats = this.afs.doc<NovelsStats>(`${dbKeys.CNovels}/${dbKeys.STATS_DOC}`).ref;

    batch.delete(refNovel);
    batch.set(refStats, upStats, { merge: true });

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
    const path = `${dbKeys.CNovels}/${this.novelID}`;
    return this.ls.like(path);
  }
  dislike(): Observable<void> {
    const path = `${dbKeys.CNovels}/${this.novelID}`;
    return this.ls.dislike(path);
  }
  unlike(): Observable<void> {
    const path = `${dbKeys.CNovels}/${this.novelID}`;
    return this.ls.reset(path);
  }
  getLikes(): Observable<LikeStats> {
    const path = `${dbKeys.CNovels}/${this.novelID}`;
    return this.ls.stats(path);
  }
  likeState(): Observable<Like> {
    const path = `${dbKeys.CNovels}/${this.novelID}`;
    return this.ls.state(path);
  }

  // LIBRARY SYSTEM
  libNovels(uid: string) {
    return this.libs.library(uid).pipe(
      map(library => this.libs.selectField(library, dbKeys.CLibraryNovels))
    );
  }
  libMyNovels() {
    return this.libs.myLibrary().pipe(
      map(library => this.libs.selectField(library, dbKeys.CLibraryNovels))
    );
  }
  inLibrary(novelID: string = this.novelID) {
    return this.libs.myLibrary().pipe(
      map(library => this.libs.inLibrary(library, dbKeys.CLibraryNovels, novelID))
    );
  }
  libAdd(novelID: string = this.novelID) {
    return this.libs.add(dbKeys.CLibraryNovels, novelID);
  }
  libRemove(novelID: string = this.novelID) {
    return this.libs.remove(dbKeys.CLibraryNovels, novelID);
  }
}
