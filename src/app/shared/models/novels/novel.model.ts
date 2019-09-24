import { firestore } from 'firebase/app';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { Genre } from './genre.model';
import { UserMeta } from '../users/user-profile.model';

// tslint:disable: no-inferrable-types
export class NovelMeta {
    id: string;
    title: string;
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

    cover?: boolean = false;
    public?: boolean = false;
    complete?: boolean = false;

    createdAt?: firestore.Timestamp | firestore.FieldValue;
    updatedAt?: firestore.Timestamp | firestore.FieldValue;
}
