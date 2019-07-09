import { firestore } from 'firebase';

// novel.model.ts

export default class Novel {
    id?: string;

    title: string;
    authorUid: string;
    coverURL: string;

    createdAt?: any;
    updatedAt?: any;

    description: string;
    tags: string[];

    // created: firebase.firestore.Timestamp = new firebase.firestore.Timestamp(new Date(''));
    nFavorites?: number;

    nRatings?: number;
    storyRating?: number;
    styleRating?: number;
    charsRating?: number;
    worldRating?: number;
    grammRating?: number;
}
