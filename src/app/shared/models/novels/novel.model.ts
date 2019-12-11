import { firestore } from 'firebase/app';
import { Genre } from './genre.model';
import { UserMeta } from '../users/user-profile.model';

// tslint:disable: no-inferrable-types
export class NovelMeta {
    id: string;
    title: string;

    constructor(nid: string, title: string) {
      this.id = nid;
      this.title = title;
    }
}

export class Novel {
    id?: string;

    author?: UserMeta;
    editors?: any;

    title: string;
    iTitle?: string;
    description: string;
    genres: Genre[];
    tags: string[] | firestore.FieldValue;

    coverThumbURL?: string; // TO-DO: Fix implementation project-wise
    coverFullURL?: string;
    public?: boolean = false;
    complete?: boolean = false;

    createdAt?: firestore.Timestamp | firestore.FieldValue;
    updatedAt?: firestore.Timestamp | firestore.FieldValue;
}

export class NovelsStats {
  updatedAt?: firestore.Timestamp | firestore.FieldValue;

  id: string;

  n?: number | firestore.FieldValue; // Published, only
  nAll?: number | firestore.FieldValue; // Private as well
  nDeleted?: number | firestore.FieldValue; // Docs deleted, ever! Just for stats...
}
