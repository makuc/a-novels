import { firestore } from 'firebase/app';

export class TagsStats {
  updatedAt?: firestore.Timestamp | firestore.FieldValue;

  nTags: number | firestore.FieldValue;
}
