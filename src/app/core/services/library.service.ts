import { dbKeys } from 'src/app/keys.config';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, throwError, EMPTY } from 'rxjs';
import { firestore } from 'firebase/app';
import { Library } from 'src/app/shared/models/library/library.model';
import { AuthenticationService } from '../authentication/authentication.service';
import { HttpErrorsHelper } from '../helpers/http-errors.helper';
import { switchMap } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LibraryService extends HttpErrorsHelper {

  constructor(
    private afs: AngularFirestore,
    private auth: AuthenticationService,
    private us: UserService
  ) {
    super();
  }

  private get user() {
    return this.auth.currentSnapshot;
  }

  private get timestamp() { return firestore.FieldValue.serverTimestamp(); }

  library(uid: string): Observable<Library> {
    if (!uid) { return this.rejectDataObservable; }

    return this.auth.getUser.pipe(
      switchMap(user => user ? this.us.getUser(uid) : this.rejectLoginObservable ), // Check if logged in
      switchMap(user => {
        if (!user) { return EMPTY; }
        const path = `${dbKeys.CLibrary}/${user.uid}`;
        return this.afs.doc<Library>(path).valueChanges();
      })
    );
  }

  myLibrary(): Observable<Library> {
    return this.auth.getUser.pipe(
      switchMap(user => {
        if (!user) { return EMPTY; }
        const path = `${dbKeys.CLibrary}/${user.uid}`;
        return this.afs.doc<Library>(path).valueChanges();
      })
    );
  }

  selectField(library: Library, field: string): string[] {
    if (!field) { return null; }// Invalid request data

    return library ? library[field] : null;
  }

  inLibrary(library: Library, field: string, id: string): boolean {
    if (!field || !id) { return null; }
    return library && library[field].indexOf(id) >= 0;
  }

  add(field: string, id: string): Promise<void> {
    if (!field || !id) {
      console.log('library.add');
      return this.rejectDataPromise;
    }
    if (!this.user) {
      console.log('lib.add');
      return this.rejectLoginPromise;
    }

    return this.afs.doc<Library>(`${dbKeys.CLibrary}/${this.user.uid}`).set({
      uid: this.user.uid,
      updatedAt: this.timestamp,
      [field]: firestore.FieldValue.arrayUnion(id)
    }, { merge: true });
  }

  remove(field: string, id: string): Promise<void> {
    if (!field || !id) {
      return this.rejectDataPromise;
    }
    if (!this.user) {
      return this.rejectLoginPromise;
    }

    return this.afs.doc<Library>(`${dbKeys.CLibrary}/${this.user.uid}`).set({
      uid: this.user.uid,
      updatedAt: this.timestamp,
      [field]: firestore.FieldValue.arrayRemove(id)
    }, { merge: true });
  }

}
