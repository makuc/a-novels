import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { dbKeys } from 'src/app/keys.config';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication/authentication.service';
import { HttpErrorsHelper } from '../helpers/http-errors.helper';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HistoryService extends HttpErrorsHelper {

  constructor(
    private afs: AngularFirestore,
    private auth: AuthenticationService
  ) {
    super();
  }

  private get user() {
    return this.auth.currentSnapshot;
  }

  getUserHistory<T>(path: string, uid: string, key: string): Observable<T> {
    if (!path || !uid || !key) { return this.rejectDataObservable; }
    return this.auth.getUser.pipe(
      switchMap(user => {
        if (!user) {// First expose yourself a little!
          return this.rejectLoginObservable;
        }
        const fullPath = `${dbKeys.C_history}/${uid}/${path}/${key}`;
        return this.afs.doc<T>(fullPath).valueChanges();
      })
    );
  }

  getMyHistory<T>(path: string, key: string): Observable<T> {
    if (!path || !key) { return this.rejectDataObservable; }
    return this.auth.getUser.pipe(
      switchMap(user => {
        if (!user) { return null; }
        const fullPath = `${dbKeys.C_history}/${user.uid}/${path}/${key}`;
        return this.afs.doc<T>(fullPath).valueChanges();
      })
    );
  }

  setMyHistory<T>(path: string, key: string, value: T): Promise<void> {
    if (!path || !key || !value) { return this.rejectDataPromise; }
    if (!this.user) { return Promise.resolve(); }
    return this.afs.doc<T>(`${dbKeys.C_history}/${this.user.uid}/${path}/${key}`).set(value, { merge: true });
  }

}
