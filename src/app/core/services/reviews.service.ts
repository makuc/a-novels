import { dbKeys } from 'src/app/keys.config';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase/app';
import { Novel } from 'src/app/shared/models/novels/novel.model';
import { first, map, debounceTime, exhaustMap, switchMap } from 'rxjs/operators';
import { NovelService } from './novel.service';
import { Observable, of, BehaviorSubject, Subject } from 'rxjs';
import { Review, ReviewsStats, ReviewNeeds } from 'src/app/shared/models/novels/review.model';
import { UserService } from './user.service';
import { LikesService } from './likes.service';
import { LikeStats, Like } from 'src/app/shared/models/like.model';
import { PaginateCollectionService } from './paginate-collection.service';

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
    private users: UserService,
    private ls: LikesService
  ) {
    super(afs);
  }

  get timestamp() {
    return firestore.FieldValue.serverTimestamp();
  }

  private rc(novelID: string) {
    return this.afs
      .collection<Novel>(dbKeys.C_NOVELS)
      .doc<Novel>(novelID)
      .collection<Review>(dbKeys.C_NOVELS_REVIEWS);
  }
  private stats(novelID: string) {
    return this.afs
      .collection<Novel>(dbKeys.C_NOVELS)
      .doc<Novel>(novelID)
      .collection(dbKeys.C_STATS)
      .doc<ReviewsStats>(dbKeys.C_STATS_Reviews);
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
    return this.stats(novelID).valueChanges();
  }

  reviewMy(novelID: string): Observable<Review> {
    return this.users
      .currentUser
      .pipe(
        first(),
        switchMap(user => this.reviewGet(novelID, user.uid))
      );
  }
  reviewGet(novelID: string, authorID: string): Observable<Review> {
    return this.rc(novelID)
      .doc<Review>(authorID)
      .valueChanges();
  }

  reviewSet(novelID: string, review: Review): Observable<void> {
    return this.stats(novelID)
      .valueChanges()
      .pipe(
        debounceTime(300),
        exhaustMap(stats => this.ensureNovelMetaExists(novelID, stats)),
        exhaustMap(stats => this.appointUserMeta(stats)),
        exhaustMap(rdata => this.appointPreviousReview(rdata)),
        exhaustMap(rdata => this.reviewCreate(review, rdata)),
        first()
      );
  }
  private appointPreviousReview(rdata: ReviewNeeds): Observable<ReviewNeeds> {
    return this.reviewGet(rdata.stats.novel.id, rdata.author.uid).pipe(
      map(review => ({ ...rdata, review }))
    );
  }
  private appointUserMeta(stats: ReviewsStats): Observable<ReviewNeeds> {
    return this.users.currentUser
      .pipe(
        first(),
        map(user => {
          return new ReviewNeeds(stats, {
            uid: user.uid,
            displayName: user.displayName
          });
        })
      );
  }
  private ensureNovelMetaExists(novelID: string, stats: ReviewsStats): Observable<ReviewsStats> {
    if (stats && stats.novel) {
      return of<ReviewsStats>(stats);
    } else {
      return this.novels
        .novelGet(novelID)
        .pipe(
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
      id: rdata.author.uid,
      author: rdata.author,
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
    const reviewRef = this.rc(rdata.stats.novel.id).doc<Review>(reviewData.id).ref;

    batch.set(reviewRef, reviewData, { merge: true });

    // Update stats
    const story = rdata.review ? reviewData.storyRating - rdata.review.storyRating : reviewData.storyRating;
    const style = rdata.review ? reviewData.styleRating - rdata.review.styleRating : reviewData.styleRating;
    const chars = rdata.review ? reviewData.charsRating - rdata.review.charsRating : reviewData.charsRating;
    const world = rdata.review ? reviewData.worldRating - rdata.review.worldRating : reviewData.worldRating;
    const gramm = rdata.review ? reviewData.grammRating - rdata.review.grammRating : reviewData.grammRating;

    const statsRef = this.stats(rdata.stats.novel.id).ref;
    batch.set(statsRef, {
      novel: rdata.stats.novel,
      updatedAt: this.timestamp,
      id: reviewData.id,
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

  reviewRemove(novelID: string, reviewID: string): Observable<void> {
    return this.rc(novelID)
      .doc<Review>(reviewID)
      .valueChanges()
      .pipe(
        first(),
        switchMap(review => {
          if (!review) { return Promise.resolve(); }

          const batch = this.afs.firestore.batch();
          const reviewRef = this.rc(novelID).doc<Review>(reviewID).ref;
          batch.delete(reviewRef);

          const statsRef = this.stats(novelID).ref;
          batch.update(statsRef, {
            updatedAt: this.timestamp,
            id: reviewID,
            nRevs: firestore.FieldValue.increment(-1),
            nDeleted: firestore.FieldValue.increment(1),

            sumStory: firestore.FieldValue.increment(-review.storyRating),
            sumStyle: firestore.FieldValue.increment(-review.styleRating),
            sumChars: firestore.FieldValue.increment(-review.charsRating),
            sumWorld: firestore.FieldValue.increment(-review.worldRating),
            sumGramm: firestore.FieldValue.increment(-review.grammRating)
          });

          return batch.commit();
        })
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
