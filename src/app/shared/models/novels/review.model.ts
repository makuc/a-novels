import { UserMeta } from '../user-profile.model';
import { firestore } from 'firebase/app';

export class Review {
    user: UserMeta;

    createdAt?: firestore.Timestamp | firestore.FieldValue;
    updatedAt?: firestore.Timestamp | firestore.FieldValue;

    storyRating: number;
    storyReview: string;

    styleRating: number;
    styleReview: string;

    charsRating: number;
    charsReview: string;

    worldRating: number;
    worldReview: string;

    grammRating: number;
    grammReview: string;
}
