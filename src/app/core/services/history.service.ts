import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { dbKeys } from 'src/app/keys.config';
import { Observable, EMPTY } from 'rxjs';
import { UserService } from './user.service';
import { first, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(
    private afs: AngularFirestore,
    private us: UserService
  ) { }

  private reject() {
    return Promise.reject({ err: 403, msg: 'You must login' });
  }

  getUserHistory<T>(path: string, uid: string, key: string): Observable<T> {
    if (!path || !uid || !key) { return EMPTY; }
    return this.afs.doc<T>(`${dbKeys.C_history}/${uid}/${path}/${key}`).valueChanges();
  }

  getMyHistory<T>(path: string, key: string): Observable<T> {
    if (!path || !key) { return EMPTY; }
    return this.us.currentUser.pipe(
      first(),
      switchMap(user => {
        if (!user) { return this.reject(); }
        return this.getUserHistory<T>(path, user.uid, key);
      })
    );
  }

  private setUserHistory<T>(path: string, uid: string, key: string, value: T): Promise<void> {
    return this.afs.doc<T>(`${dbKeys.C_history}/${uid}/${path}/${key}`)
      .set(value, { merge: true });
  }

  setMyHistory<T>(path: string, key: string, value: T): Observable<void> {
    if (!path || !key || !value) { return EMPTY; }
    return this.us.currentUser.pipe(
      first(),
      switchMap(user => {
        if (!user) { return this.reject(); }
        return this.setUserHistory<T>(path, user.uid, key, value);
      })
    );
  }


}
