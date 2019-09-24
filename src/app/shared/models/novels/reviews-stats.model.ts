import { firestore } from 'firebase/app';

export class ReviewsStats {
  updatedAt?: firestore.Timestamp | firestore.FieldValue;

  nReviews: number | firestore.FieldValue;
}
