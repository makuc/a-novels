import { firestore } from 'firebase/app';
import { NovelMeta } from '../novels/novel.model';
import { UserMeta } from '../users/user-profile.model';

// tslint:disable: no-inferrable-types
export class Library {
  uid: string;
  updatedAt?: firestore.Timestamp | firestore.FieldValue;
  novels?: string[] | firestore.FieldValue; // IDs only

  constructor(uid: string) {
    this.uid = uid;
    this.novels = [];
  }
}
