import { UserMeta } from '../users/user-profile.model';
import { firestore } from 'firebase/app';

export class Comment {
    user: UserMeta;
    comment: string;

    createdAt?: firestore.Timestamp | firestore.FieldValue;
    updatedAt?: firestore.Timestamp | firestore.FieldValue;
}

export class CommentsStats {
  updatedAt?: firestore.Timestamp | firestore.FieldValue;

  nComments: number | firestore.FieldValue;
}
