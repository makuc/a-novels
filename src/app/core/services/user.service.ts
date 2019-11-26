import { keysConfig, dbKeys } from 'src/app/keys.config';
import { Injectable } from '@angular/core';
import { User, auth } from 'firebase/app';
import { UserProfile } from 'src/app/shared/models/users/user-profile.model';
import { Observable, EMPTY } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap, map } from 'rxjs/operators';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({ providedIn: 'root' })
export class UserService {

  // Implementation
  constructor(
    private as: AuthenticationService,
    private afs: AngularFirestore
  ) { }

  getUser(uid: string): Observable<UserProfile> {
    if (!uid) { return EMPTY; }
    return this.afs.doc<UserProfile>(`${dbKeys.CUsers}/${uid}`).valueChanges();
  }

  getMe(): Observable<UserProfile> {
    return this.as.getUser.pipe(
      map(user => user ? user.uid : undefined),
      switchMap(uid => this.getUser(uid))
    );
  }

  get currentUser(): Observable<UserProfile> {
    return this.getMe();
  }

  // Delete user from Auth to remove matching doc from this collection

}
