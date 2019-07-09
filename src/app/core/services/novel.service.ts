import { dbKeysConfig } from 'src/app/keys.config';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import Novel from 'src/app/shared/models/novel.model';
import { Observable } from 'rxjs';
import { firestore } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class NovelService {
// tslint:disable: variable-name
  private _novels: AngularFirestoreCollection<Novel>;
// tslint:enable: variable-name

  constructor(
    private afStore: AngularFirestore
  ) {
    this._novels = this.afStore.collection(dbKeysConfig.COLLECTION_NOVELS);
  }

  get timestamp() {
    return firestore.FieldValue.serverTimestamp();
  }

  get(): Observable<Novel[]> {
    return this._novels.valueChanges();
  }

  add(data: Novel): Promise<void> {
    const timestamp = this.timestamp;
    const id = this.afStore.createId();
    return this._novels.doc(id).set({
      id,
      ...data,
      updatedAt: timestamp,
      createdAt: timestamp
    });
  }

  update(id: string, data: any) {
    this._novels.doc(id).update({
      ...data,
      updatedAt: this.timestamp
    });
  }

  remove(id: string): Promise<void> {
    const batch = this.afStore.firestore.batch();

    const novel = this.afStore.doc<Novel>(id);

    return batch.commit();
  }

  select(id: string): Observable<Novel> {
    return this._novels.doc<Novel>(id).valueChanges();
  }
/*
  filterByTags(novels: Novels[]): Novels[] {
    return novels.filter()
  }
*/
}
