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
}
