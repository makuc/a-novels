import { firestore } from 'firebase/app';
import { NovelMeta } from './novel.model';
import { UserMeta } from '../users/user-profile.model';

export class FavouriteNeeds {
  uid: string;
  stats: FavouritesStats;

  constructor(stats: FavouritesStats, uid: string) {
    this.uid = uid;
    this.stats = stats;
  }
}

export class Favourite {
  createdAt?: firestore.Timestamp | firestore.FieldValue;
  uid: string;
  novel?: NovelMeta;
  like?: boolean;
}

export class FavouritesStats {
  novel: NovelMeta;
  updatedAt?: firestore.Timestamp | firestore.FieldValue;
  id?: string;

  nFavs: number | firestore.FieldValue;

  constructor(novel: NovelMeta) {
    this.novel = novel;
    this.nFavs = 0;
    this.updatedAt = firestore.FieldValue.serverTimestamp();
  }
}
