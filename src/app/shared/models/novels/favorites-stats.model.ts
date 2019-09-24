import { firestore } from 'firebase/app';

export class FavoritesStats {
  updatedAt?: firestore.Timestamp | firestore.FieldValue;

  n: number | firestore.FieldValue;
}
