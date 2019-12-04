import { keysConfig, dbKeys } from 'src/app/keys.config';
import { Injectable } from '@angular/core';
import { User, auth } from 'firebase/app';
import { UserProfile } from 'src/app/shared/models/users/user-profile.model';
import { Observable, EMPTY, from } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { switchMap, map, exhaustMap, first } from 'rxjs/operators';
import { AuthenticationService } from '../authentication/authentication.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class UserService {

  // Implementation
  constructor(
    private afAuth: AngularFireAuth,
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

  changeDisplayName(name: string): Observable<void> {
    return from(this.changeUserAuthDisplayName(name)).pipe(
      exhaustMap(() => this.changeUserProfileName(name)),
      first()
    );
  }

  private changeUserAuthDisplayName(name: string): Promise<void> {
    return this.afAuth.auth.currentUser.updateProfile({
      displayName: name
    });
  }
  private changeUserProfileName(name: string): Promise<void> {
    return this.afs.doc<UserProfile>(`${dbKeys.CUsers}/${this.afAuth.auth.currentUser.uid}`).update({
      displayName: name
    });
  }

}
