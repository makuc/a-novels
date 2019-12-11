import { firestore } from 'firebase/app';
import { UserMeta } from '../users/user-profile.model';
import { NovelMeta } from './novel.model';

// tslint:disable: no-inferrable-types

export class ReviewNeeds {
  stats: ReviewsStats;
  review?: Review;

  constructor(stats: ReviewsStats) {
    this.stats = stats;
  }
}

export class Review {
  id?: string;
  author?: UserMeta;
  novel?: NovelMeta;

  title: string = '';

  storyRating: number = 0;
  styleRating: number = 0;
  charsRating: number = 0;
  worldRating: number = 0;
  grammRating: number = 0;

  storyReview: string = '';
  styleReview: string = '';
  charsReview: string = '';
  worldReview: string = '';
  grammReview: string = '';

  createdAt?: firestore.Timestamp | firestore.FieldValue;
  updatedAt?: firestore.Timestamp | firestore.FieldValue;

  likes?: number | firestore.FieldValue;
  dislikes?: number | firestore.FieldValue;
  likeID?: string;

  constructor() { }
}

export class ReviewsStats {
  novel: NovelMeta;
  updatedAt?: firestore.Timestamp | firestore.FieldValue;
  id: string;

  nFavs: number | firestore.FieldValue = 0;
  nRevs: number | firestore.FieldValue = 0;
  sumStory: number | firestore.FieldValue = 0;
  sumStyle: number | firestore.FieldValue = 0;
  sumChars: number | firestore.FieldValue = 0;
  sumWorld: number | firestore.FieldValue = 0;
  sumGramm: number | firestore.FieldValue = 0;

  constructor(novel: NovelMeta) {
    this.novel = novel;
    this.updatedAt = firestore.FieldValue.serverTimestamp();
  }
}
