import { firestore } from 'firebase/app';

export class GenresStats {
  updatedAt?: firestore.Timestamp | firestore.FieldValue;

  nGenres: number | firestore.FieldValue;
}
