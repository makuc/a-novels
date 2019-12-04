import { dbKeys } from 'src/app/keys.config';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, of, empty, EMPTY } from 'rxjs';
import { firestore } from 'firebase/app';
import { map, first, switchMap, tap } from 'rxjs/operators';
import { UserService } from './user.service';
import { Library } from 'src/app/shared/models/library/library.model';

@Injectable({
  providedIn: 'root'
})
export class LibraryService {

  constructor(
    private afs: AngularFirestore,
    private us: UserService
  ) { }

  get timestamp() { return firestore.FieldValue.serverTimestamp(); }

  private reject() {
    return Promise.reject({ err: 403, msg: 'You must login' });
  }

  library(uid: string): Observable<Library> {
    if (!uid) { return EMPTY; }
    const path = `${dbKeys.C_library}/${uid}`;
    return this.afs.doc<Library>(path).valueChanges();
  }

  libraryField(uid: string, field: string): Observable<string[]> {
    if (!uid || !field) { return EMPTY; }
    return this.library(uid).pipe(
      map(lib => lib[field])
    );
  }

  myLibrary(): Observable<Library> {
    return this.us.currentUser.pipe(
      first(),
      switchMap(user => {
        if (!user) { return EMPTY; }
        return this.library(user.uid);
      })
    );
  }

  myLibraryField(field: string): Observable<string[]> {
    if (!field) { return EMPTY; }
    return this.myLibrary().pipe(
      map(lib => lib ? lib[field] : null)
    );
  }

  inLibrary(field: string, id: string): Observable<boolean> {
    if (!field || !id) { return EMPTY; }
    return this.myLibrary().pipe(
      map(lib => lib && (lib[field] as string[]).indexOf(id) >= 0)
    );
  }

  add(field: string, id: string): Observable<void> {
    if (!field || !id) { return EMPTY; }
    return this.us.currentUser.pipe(
      first(),
      switchMap(user => {
        if (!user) { return this.reject(); }
        return this.addEntry(user.uid, field, id);
      })
    );
  }

  remove(field: string, id: string): Observable<void> {
    if (!field || !id) { return EMPTY; }
    return this.us.currentUser.pipe(
      first(),
      switchMap(user => {
        if (!user) { return this.reject(); }
        return this.removeEntry(user.uid, field, id);
      })
    );
  }

  private addEntry(uid: string, field: string, id: string): Promise<void> {
    if (!uid || !field || !id) { return this.reject(); }
    return this.afs.doc<Library>(`${dbKeys.C_library}/${uid}`).set({
      uid,
      updatedAt: this.timestamp,
      [field]: firestore.FieldValue.arrayUnion(id)
    }, { merge: true });
  }

  private removeEntry(uid: string, field: string, id: string): Promise<void> {
    if (!uid || !field || !id) { return this.reject(); }
    return this.afs.doc<Library>(`${dbKeys.C_library}/${uid}`).set({
      uid,
      updatedAt: this.timestamp,
      [field]: firestore.FieldValue.arrayRemove(id)
    }, { merge: true });
  }

}
