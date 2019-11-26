import { firestore } from 'firebase/app';
import { NovelMeta } from '../novels/novel.model';

// tslint:disable: no-inferrable-types
export class HistoryNovel {
  novel: NovelMeta;
  chapterID: string; // Actual chapter ID
  index: number; // Index of the lastly opened chapter, just in case!
  read: boolean = false; // If chapter was read till the end
}

export class History {
  uid: string;
  updatedAt: firestore.Timestamp | firestore.FieldValue;
}
