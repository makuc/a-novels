import { firestore } from 'firebase/app';

export class CommentsStats {
  updatedAt?: firestore.Timestamp | firestore.FieldValue;

  nComments: number | firestore.FieldValue;
}
