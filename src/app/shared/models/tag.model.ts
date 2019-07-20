import { firestore } from 'firebase/app';

export interface Tag {
    name: string;
    createdAt?: firestore.Timestamp | firestore.FieldValue;
    updatedAt?: firestore.Timestamp | firestore.FieldValue;
    description?: string;
}
