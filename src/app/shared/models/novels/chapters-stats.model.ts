import { firestore } from 'firebase/app';
import { ChapterMeta } from './chapter.model';

export class ChaptersStats {
  updatedAt: firestore.Timestamp | firestore.FieldValue;
  id: string;

  public: ChapterMeta[]; // Rules, compare array values?? Otherwise compare SIZE
  private: ChapterMeta[];
}
