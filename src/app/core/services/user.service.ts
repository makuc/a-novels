import { dbKeys } from 'src/app/keys.config';
import { Injectable } from '@angular/core';
import { UserProfile } from 'src/app/shared/models/users/user-profile.model';
import { Observable, EMPTY, from } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { exhaustMap, first } from 'rxjs/operators';
import { AuthenticationService } from '../authentication/authentication.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class UserService {

  // Implementation
  constructor(
    private afAuth: AngularFireAuth,
    private auth: AuthenticationService,
    private afs: AngularFirestore
  ) { }

  private get user() {
    return this.auth.currentSnapshot;
  }

  getUser(uid: string): Observable<UserProfile> {
    if (!uid) { return EMPTY; }
    return this.afs.doc<UserProfile>(`${dbKeys.CUsers}/${uid}`).valueChanges();
  }

  get currentUser(): Observable<UserProfile> {
    if (!this.user) { return EMPTY; }
    return this.getUser(this.user.uid);
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
    const path = `${dbKeys.CUsers}/${this.afAuth.auth.currentUser.uid}`;
    return this.afs.doc<UserProfile>(path).update({
      displayName: name
    });
  }

}
