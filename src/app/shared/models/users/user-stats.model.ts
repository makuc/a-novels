import { firestore } from 'firebase/app';

export class UsersStats {
  updatedAt?: firestore.Timestamp | firestore.FieldValue;

  nUsers: number | firestore.FieldValue;
}
