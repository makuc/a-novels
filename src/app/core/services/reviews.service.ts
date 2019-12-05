import { dbKeys } from 'src/app/keys.config';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import { first, map, debounceTime, exhaustMap } from 'rxjs/operators';
import { NovelService } from './novel.service';
import { Observable, of, EMPTY, throwError } from 'rxjs';
import { Review, ReviewsStats, ReviewNeeds } from 'src/app/shared/models/novels/review.model';
import { LikesService } from './likes.service';
import { LikeStats, Like } from 'src/app/shared/models/like.model';
import { PaginateCollectionService } from './paginate-collection.service';
import { AuthenticationService } from '../authentication/authentication.service';

interface ReviewsQueryConfig {
  novelID: string;
  field: string; // field to orderBy
  limit: number; // limit per query
  reverse: boolean; // reverse order
  prepend: boolean; // prepend to source
}
@Injectable({
  providedIn: 'root'
})
export class ReviewsService extends PaginateCollectionService<Review> {
// tslint:disable: variable-name
  private novelID: string;
// tslint:enable: variable-name

  constructor(
    afs: AngularFirestore,
    private novels: NovelService,
    private auth: AuthenticationService,
    private ls: LikesService
  ) {
    super(afs);
  }

  private get user() {
    return this.auth.currentSnapshot;
  }

  get timestamp() {
    return firestore.FieldValue.serverTimestamp();
  }

  private pathRC(novelID: string) {
    return `${dbKeys.C_NOVELS}/${novelID}/${dbKeys.C_NOVELS_REVIEWS}`;
  }
  private pathStats(novelID: string) {
    return `${dbKeys.C_NOVELS}/${novelID}/${dbKeys.C_STATS}/${dbKeys.C_STATS_Reviews}`;
  }

  // Implementation for retrieving reviews
  // Initial query sets options and defines the Observable
  // passing opts will override the defaults
  init(novelID: string, opts?: any) {
    this.novelID = novelID;
    const path = `${dbKeys.C_NOVELS}/${novelID}/${dbKeys.C_NOVELS_REVIEWS}`;
    super.doInit(path, opts);
  }

  // Reviews Management
  statsGet(novelID: string) {
    return this.afs.doc<ReviewsStats>(this.pathStats(novelID)).valueChanges();
  }

  reviewMy(novelID: string): Observable<Review> {
    if (!this.user) { return EMPTY; }
    this.novelID = novelID;
    return this.reviewGet(novelID);
  }
  private reviewGet(novelID: string, authorID: string = this.user.uid): Observable<Review> {
    const path = `${this.pathRC(novelID)}/${authorID}`;
    return this.afs.doc<Review>(path).valueChanges();
  }

  reviewSet(novelID: string, review: Review): Observable<void> {
    if (!this.user) {
      console.log('reviews.reviewSet');
      return this.rejectLoginObservable;
    }

    return this.afs.doc<ReviewsStats>(this.pathStats(novelID)).valueChanges().pipe(
        debounceTime(250),
        exhaustMap(stats => this.ensureNovelMetaExists(novelID, stats)),
        exhaustMap(stats => this.appointPreviousReview(stats)),
        exhaustMap(rdata => this.reviewCreate(review, rdata)),
        first()
      );
  }
  private appointPreviousReview(stats: ReviewsStats): Observable<ReviewNeeds> {
    return this.reviewGet(stats.novel.id).pipe(
      map(review => ({ stats, review }))
    );
  }
  private ensureNovelMetaExists(novelID: string, stats: ReviewsStats): Observable<ReviewsStats> {
    if (stats && stats.novel) {
      return of<ReviewsStats>(stats);
    } else {
      return this.novels.novelGet(novelID).pipe(
        map(novel => {
          return new ReviewsStats(
              {
                id: novel.id,
                title: novel.title
              }
            );
        })
      );
    }
  }
  private reviewCreate(review: Review, rdata: ReviewNeeds): Promise<void> {
    const reviewData: Review = {
      id: this.user.uid,
      author: {
        uid: this.user.uid,
        displayName: this.user.displayName
      },
      novel: rdata.stats.novel,

      title: review.title,

      storyRating: review.storyRating,
      styleRating: review.styleRating,
      charsRating: review.charsRating,
      worldRating: review.worldRating,
      grammRating: review.grammRating,

      storyReview: review.storyReview,
      styleReview: review.styleReview,
      charsReview: review.charsReview,
      worldReview: review.worldReview,
      grammReview: review.grammReview,

      createdAt: review.createdAt || this.timestamp,
      updatedAt: this.timestamp
    };

    // Get a new write batch
    const batch = this.afs.firestore.batch();

    // Create the chapter
    const pathReview = `${this.pathRC(rdata.stats.novel.id)}/${this.user.uid}`;
    const reviewRef = this.afs.doc<Review>(pathReview).ref;

    batch.set(reviewRef, reviewData, { merge: true });

    // Update stats
    const story = rdata.review ? reviewData.storyRating - rdata.review.storyRating : reviewData.storyRating;
    const style = rdata.review ? reviewData.styleRating - rdata.review.styleRating : reviewData.styleRating;
    const chars = rdata.review ? reviewData.charsRating - rdata.review.charsRating : reviewData.charsRating;
    const world = rdata.review ? reviewData.worldRating - rdata.review.worldRating : reviewData.worldRating;
    const gramm = rdata.review ? reviewData.grammRating - rdata.review.grammRating : reviewData.grammRating;

    const statsRef = this.afs.doc<ReviewsStats>(this.pathStats(rdata.stats.novel.id)).ref;
    batch.set(statsRef, {
      novel: rdata.stats.novel,
      updatedAt: this.timestamp,
      id: this.user.uid,
      nRevs: firestore.FieldValue.increment(review.createdAt ? 0 : 1),
      sumStory: firestore.FieldValue.increment(story),
      sumStyle: firestore.FieldValue.increment(style),
      sumChars: firestore.FieldValue.increment(chars),
      sumWorld: firestore.FieldValue.increment(world),
      sumGramm: firestore.FieldValue.increment(gramm)
    }, { merge: true });

    // Commit the batch
    return batch.commit();
  }

  reviewRemove(novelID: string): Observable<void> {
    if (!this.user) {
      console.log('reviews.reviewRemove');
      return this.rejectLoginObservable;
    }

    const pathReview = `${this.pathRC(novelID)}/${this.user.uid}`;
    const refReview = this.afs.doc<Review>(pathReview).ref;
    const refStats = this.afs.doc<ReviewsStats>(this.pathStats(novelID)).ref;
    return this.afs.doc<Review>(pathReview).valueChanges().pipe(
      exhaustMap(review => {
        if (!review) { return Promise.resolve(); }

        const batch = this.afs.firestore.batch();
        batch.delete(refReview);
        batch.update(refStats, {
          updatedAt: this.timestamp,
          id: this.user.uid,
          nRevs: firestore.FieldValue.increment(-1),
          nDeleted: firestore.FieldValue.increment(1),

          sumStory: firestore.FieldValue.increment(-review.storyRating),
          sumStyle: firestore.FieldValue.increment(-review.styleRating),
          sumChars: firestore.FieldValue.increment(-review.charsRating),
          sumWorld: firestore.FieldValue.increment(-review.worldRating),
          sumGramm: firestore.FieldValue.increment(-review.grammRating)
        });
        return batch.commit();
      }),
      first()
    );
  }

  // LIKE/DISLIKE SYSTEM
  like(reviewID: string): Observable<void> {
    const path = `${dbKeys.C_NOVELS}/${this.novelID}/${dbKeys.C_NOVELS_REVIEWS}/${reviewID}`;
    return this.ls.like(path);
  }
  dislike(reviewID: string): Observable<void> {
    const path = `${dbKeys.C_NOVELS}/${this.novelID}/${dbKeys.C_NOVELS_REVIEWS}/${reviewID}`;
    return this.ls.dislike(path);
  }
  unlike(reviewID: string): Observable<void> {
    const path = `${dbKeys.C_NOVELS}/${this.novelID}/${dbKeys.C_NOVELS_REVIEWS}/${reviewID}`;
    return this.ls.reset(path);
  }
  getLikes(reviewID: string): Observable<LikeStats> {
    const path = `${dbKeys.C_NOVELS}/${this.novelID}/${dbKeys.C_NOVELS_REVIEWS}/${reviewID}`;
    return this.ls.stats(path);
  }
  likeState(reviewID: string): Observable<Like> {
    const path = `${dbKeys.C_NOVELS}/${this.novelID}/${dbKeys.C_NOVELS_REVIEWS}/${reviewID}`;
    return this.ls.state(path);
  }

}
