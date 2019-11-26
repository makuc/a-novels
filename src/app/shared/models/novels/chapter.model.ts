import { firestore } from 'firebase/app';
import { NovelMeta } from './novel.model';

export class Chapter {
  id?: string;
  novel?: NovelMeta;

  title: string;
  content: string;

  public: boolean;

  createdAt?: firestore.Timestamp | firestore.FieldValue;
  updatedAt?: firestore.Timestamp | firestore.FieldValue;
}

export class ChapterMeta {
  id: string;
  title: string;
  createdAt?: firestore.Timestamp | firestore.FieldValue;
  public: boolean;

  constructor(id: string, title: string, chPublic: boolean, createdAt: firestore.Timestamp | firestore.FieldValue) {
    this.id = id;
    this.title = title;
    this.public = chPublic;
    this.createdAt = createdAt;
  }
}
