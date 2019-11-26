import { dbKeys } from 'src/app/keys.config';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { firestore } from 'firebase/app';
import { Genre } from 'src/app/shared/models/novels/genre.model';


@Injectable({
  providedIn: 'root'
})
export class GenresService {
// tslint:disable: variable-name
  private _genres: AngularFirestoreCollection<Genre>;
// tslint:enable: variable-name

  constructor(
    private afStore: AngularFirestore
  ) {
    this._genres = this.afStore.collection<Genre>(dbKeys.C_GENRES, ref => ref.orderBy('name'));
  }

  get timestamp() {
    return firestore.FieldValue.serverTimestamp();
  }

  get(): Observable<Genre[]> {
    return this._genres.valueChanges();
  }

  add(genre: Genre): Promise<string> {
    return this._genres.doc<Genre>(genre.name.toLowerCase()).set({
      name: genre.name,
      description: genre.description
    })
    .then(
        () => genre.name,
        (err) => err
    );
  }

  update(name: string, data: any) {
    this._genres.doc<Genre>(name.toLowerCase()).update({
      description: data.description
    });
  }

  remove(name: string): Promise<void> {
    return this._genres.doc<Genre>(name.toLowerCase()).delete();
  }

  select(name: string): Observable<Genre> {
    return this._genres.doc<Genre>(name.toLowerCase()).valueChanges();
  }
/*
  filterByGenre(novels: Novels[]): Novels[] {
    return novels.filter()
  }
*/
}
