import { firestore } from 'firebase/app';

export class Favorite {
  createdAt: firestore.Timestamp | firestore.FieldValue;
}
