import { keysConfig } from 'src/app/keys.config';

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { auth, User } from 'firebase/app';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserProfile } from 'src/app/shared/models/users/user-profile.model';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  /* tslint:disable:variable-name */
  private _credentials: auth.AuthCredential;
  private _users: AngularFirestoreCollection<UserProfile>;
  /* tslint:enable:variable-name */

  constructor(
    private afAuth: AngularFireAuth,
    private alert: MatSnackBar
  ) { }

  get getUser(): Observable<User> {
    return this.afAuth.user
      .pipe(
        shareReplay(1)
      );
  }
  get tokenResults(): Observable<auth.IdTokenResult> {
    return this.afAuth.idTokenResult
      .pipe(
        shareReplay(1)
      );
  }

  loginEmail(email: string, password: string) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(
        (userCredential) => {
          this._credentials = userCredential.credential;
          return userCredential.user;
        },
        (error) => {
          return error;
        }
      );
  }
  createEmail(email: string, password: string) {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(
        (userCredential) => {
          this._credentials = userCredential.credential;

          return userCredential.user;
        },
        (error) => {
          if (error.code === 'auth/weak-password') {
            this.alert.open('Password is too weak!', 'Dismiss', {
              duration: 2500
            });
          } else if (error.code === 'auth/operation-not-allowed') {
            this.alert.open('App doesn\'t allow this login method!', 'Dismiss');
          } else if (error.code === 'auth/invalid-email') {
            this.alert.open('Provided e-mail is invalid!', 'Dismiss');
          } else if (error.code === 'auth/email-already-in-use') {
            this.alert.open('User with this e-mail already exists!', 'Dismiss');
          } else {
            this.alert.open('Unknown error... Peek at console!', 'Dismiss');
            console.error(error);
          }

          return error;
        }
      );
  }
  loginGoogle() {
    const provider = new auth.GoogleAuthProvider();
    provider.addScope('email');

    const prom = this.afAuth.auth.signInWithPopup(provider);
    prom.then(
      userCredential => {
        this._credentials = userCredential.credential;

        return userCredential.user;
      },
      error => {
        // The provider's account email, can be used in case of
        // auth/account-exists-with-different-credential to fetch the providers
        // linked to the email:
        const email = error.email;
        // The provider's credential:
        const credential = error.credential;
        // In case of auth/account-exists-with-different-credential error,
        // you can fetch the providers using this:
        switch (error.code) {
          case 'auth/account-exists-with-different-credential':
            this.alert.open('An account with this email already exists.');
            break;
          case 'auth/auth-domain-config-required':
            break;
        }
      }
    );
    return prom;
  }
  loginFacebook() {
    return this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider());
  }

  logout() {
    return this.afAuth.auth.signOut();
  }

  discoverProviders(email: string) {
    this.afAuth.auth
      .fetchSignInMethodsForEmail(email)
      .then(
        providers => {
          // The returned 'providers' is a list of the available providers
          // linked to the email address. Please refer to the guide for a more
          // complete explanation on how to recover from this error.
          return providers;
        },
        error => {
          console.error('Error getting providers:', error);
          return error;
        });
  }

}
