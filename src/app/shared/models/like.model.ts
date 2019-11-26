import { firestore } from 'firebase/app';

export class FavouriteNeeds {
  uid: string;
  stats: LikeStats;

  constructor(stats: LikeStats, uid: string) {
    this.uid = uid;
    this.stats = stats;
  }
}

export class Like {
  createdAt?: firestore.Timestamp | firestore.FieldValue;
  uid: string;
  id?: string;
  value?: boolean;
}

export class LikeStats {
  path?: string;
  updatedAt?: firestore.Timestamp | firestore.FieldValue;
  id?: string;

  pos: number | firestore.FieldValue;
  neg: number | firestore.FieldValue;

  constructor() {
    this.pos = 0;
    this.neg = 0;
    this.updatedAt = firestore.FieldValue.serverTimestamp();
  }
}
