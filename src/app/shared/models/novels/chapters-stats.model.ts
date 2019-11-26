import { firestore } from 'firebase/app';
import { ChapterMeta } from './chapter.model';
import { NovelMeta } from './novel.model';
import { UserMeta } from '../users/user-profile.model';


export class ChaptersList {
  [index: number]: ChapterMeta;
}

export class TOC {
  indexes: string[];
  toc: ChaptersList;

  constructor(indexes: string[], toc: ChaptersList) {
    this.indexes = indexes;
    this.toc = toc;
  }
}

export class ChaptersStats {
  id?: string;
  novel: NovelMeta;
  author: UserMeta;
  public?: number; // Rules, compare array values?? Otherwise compare SIZE
  private?: number;

  updatedAt: firestore.Timestamp | firestore.FieldValue = firestore.FieldValue.serverTimestamp();
  nextIndex = 0;

  toc: ChaptersList; // Indexed
  notes?: NovelMeta[]; // Unindexed


  constructor(
    novel: NovelMeta,
    author: UserMeta,
    nextIndex = 0
  ) {
    this.novel = novel;
    this.author = author;
    this.nextIndex = nextIndex;
  }
}
