import { firestore } from 'firebase/app';
import { NovelMeta } from './novel.model';

export class Chapter {
    id?: string;
    novel: NovelMeta;

    title: string;
    chapter: string;

    createdAt?: firestore.Timestamp | firestore.FieldValue;
    updatedAt?: firestore.Timestamp | firestore.FieldValue;
}
