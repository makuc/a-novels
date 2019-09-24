import { firestore } from 'firebase/app';

export class NovelsStats {
  updatedAt?: firestore.Timestamp | firestore.FieldValue;

  n?: number | firestore.FieldValue; // Published, only
  nAll?: number | firestore.FieldValue; // Private as well
  nDeleted?: number | firestore.FieldValue; // Docs deleted, ever! Just for stats...
}
