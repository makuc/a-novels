import { firestore } from 'firebase/app';

export class Tag {
    name: string;
    createdAt?: firestore.Timestamp | firestore.FieldValue;
    updatedAt?: firestore.Timestamp | firestore.FieldValue;
    description?: string;
}

export class TagsStats {
  updatedAt?: firestore.Timestamp | firestore.FieldValue;

  nTags: number | firestore.FieldValue;
}
