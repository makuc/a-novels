import { firestore } from 'firebase/app';

export class Genre {
    name: string;
    description?: string;
}

export class GenresStats {
  updatedAt?: firestore.Timestamp | firestore.FieldValue;

  nGenres: number | firestore.FieldValue;
}
