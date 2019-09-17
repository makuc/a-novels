import { dbKeys } from 'src/app/keys.config';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { firestore } from 'firebase/app';
import { Tag } from 'src/app/shared/models/novels/tag.model';


@Injectable({
  providedIn: 'root'
})
export class TagsService {
// tslint:disable: variable-name
  private _tags: AngularFirestoreCollection<Tag>;
// tslint:enable: variable-name

  constructor(
    private afStore: AngularFirestore
  ) {
    this._tags = this.afStore.collection<Tag>(dbKeys.COLLECTION_TAGS, ref => ref.orderBy('name'));
  }

  get timestamp() {
    return firestore.FieldValue.serverTimestamp();
  }

  get(): Observable<Tag[]> {
    return this._tags.valueChanges();
  }

  add(data: Tag): Promise<void> {
    const timestamp = this.timestamp;
    return this._tags.doc<Tag>(data.name).set({
      name: data.name,
      description: data.description,
      createdAt: timestamp
    });
  }

  update(name: string, data: any) {
    this._tags.doc<Tag>(name).update({
      description: data.description,
      updatedAt: this.timestamp
    });
  }

  remove(name: string): Promise<void> {
    return this._tags.doc<Tag>(name).delete();
  }

  select(name: string): Observable<Tag> {
    return this._tags.doc<Tag>(name).valueChanges();
  }
/*
  filterByTags(novels: Novels[]): Novels[] {
    return novels.filter()
  }
*/
}
