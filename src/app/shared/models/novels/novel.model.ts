import { firestore } from 'firebase/app';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { Genre } from './genre.model';
import { UserMeta } from '../user-profile.model';

// tslint:disable: no-inferrable-types

export class NovelMeta {
    id: string;
    title: string;
}

export class NovelRating {
    nRatings: number = 0;
    storyRating: number = 0;
    styleRating: number = 0;
    charsRating: number = 0;
    worldRating: number = 0;
    grammRating: number = 0;
}

export class Novel {
    id?: string;

    author?: UserMeta;
    editors?: any;

    title: string;
    description: string;
    genres: Genre[];
    tags: string[];

    cover?: boolean = false;
    published?: boolean = false;
    complete?: boolean = false;

    createdAt?: firestore.Timestamp | firestore.FieldValue;
    updatedAt?: firestore.Timestamp | firestore.FieldValue;

    nFavorites?: number = 0;

    ratings?: NovelRating;
}
