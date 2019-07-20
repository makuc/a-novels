import { dbKeysConfig } from 'src/app/keys.config';
import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import Novel from 'src/app/shared/models/novel.model';
import { firestore } from 'firebase/app';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { UserProfile } from 'src/app/shared/models/user-profile.model';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WorkshopService {
// tslint:disable: variable-name
  private _novels: AngularFirestoreCollection<Novel>;
  private _user: UserProfile;
// tslint:enable: variable-name

  constructor(
    private afStore: AngularFirestore,
    private users: UserService
  ) {
    this._novels = this.afStore.collection(dbKeysConfig.COLLECTION_NOVELS);
    this.users
      .getMe()
      .pipe(
        take(1)
      )
      .subscribe(user => this._user = user);

  }

  private get timestamp() {
    return firestore.FieldValue.serverTimestamp();
  }

  get novels(): Observable<Novel[]> {
    return this._novels.valueChanges();
  }

  novelAdd(data: Novel): Promise<void> {
    const timestamp = this.timestamp;
    const id = this.afStore.createId();

    return this._novels.doc<Novel>(id).set({
      id,
      author: {
        uid: this._user.uid,
        displayName: this._user.displayName
      },

      title: data.title,
      coverURL: data.coverURL,
      published: data.published,
      createdAt: timestamp,

      description: data.description,
      tags: data.tags
    });
  }

  novelEditDescription(id: string, description: string): Promise<void> {
    return this._novels.doc<Novel>(id).update({
      description,
      updatedAt: this.timestamp
    });
  }

  novelEditTags(id: string, tags: string[]): Promise<void> {
    return this._novels.doc<Novel>(id).update({
      tags,
      updatedAt: this.timestamp
    });
  }

  novelEdit(data: Novel): Promise<void> {
    return this._novels.doc<Novel>(data.id).update({
      title: data.title,
      coverURL: data.coverURL,
      published: data.published,

      updatedAt: this.timestamp,

      description: data.description,
      tags: data.tags
    });
  }

  novelDelete(id: string): Promise<void> {
    return this._novels.doc<Novel>(id).delete();
  }

}
