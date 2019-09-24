import { firestore } from 'firebase/app';

export class ChaptersStats {
  updatedAt?: firestore.Timestamp | firestore.FieldValue;

  nChapters: number | firestore.FieldValue;
}
