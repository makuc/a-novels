import { firestore, User } from 'firebase/app';
import { AngularFirestoreDocument } from '@angular/fire/firestore';

// novel.model.ts

export default class Novel {
    id?: string;

    title: string;
    author?: {
        uid: string;
        displayName: string;
        ref?: AngularFirestoreDocument<User>;
    };
    editors?: any;

    coverURL: string;
    published: boolean;

    createdAt?: firestore.Timestamp | firestore.FieldValue;;
    updatedAt?: firestore.Timestamp | firestore.FieldValue;;

    description: string;
    tags: string[];

    nFavorites?: number;

    nRatings?: number;
    storyRating?: number;
    styleRating?: number;
    charsRating?: number;
    worldRating?: number;
    grammRating?: number;
}
