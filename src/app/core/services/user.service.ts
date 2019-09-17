import { keysConfig, dbKeys } from 'src/app/keys.config';
import { Injectable, OnInit } from '@angular/core';
import { User, auth } from 'firebase/app';
import { UserProfile } from 'src/app/shared/models/user-profile.model';

import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { first, take, switchMap, map } from 'rxjs/operators';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({ providedIn: 'root' })
export class UserService {
    /* tslint:disable: variable-name */
    private _user: AngularFirestoreDocument<UserProfile>;
    private _users: AngularFirestoreCollection<UserProfile>;
    /* tslink:enable: variable-name */

    public user: Observable<UserProfile>;

    // Implementation
    constructor(
        private authService: AuthenticationService,
        private afStore: AngularFirestore
    ) {
        this._users = this.afStore.collection(dbKeys.COLLECTION_USERS);
        // this._userProfile = this._usersCollection.doc
    }

    getUsers(): Observable<UserProfile[]> {
        return this._users.valueChanges();
    }

    getUser(uid: string): Observable<UserProfile> {
        return this._users.doc<UserProfile>(uid).valueChanges();
    }

    getMe(): Observable<UserProfile> {
        return this.authService.getUser
            .pipe(
                map(user => user.uid),
                switchMap(uid => this.getUser(uid))
            );
    }

    get currentUser(): Observable<UserProfile> {
        return this.getMe();
    }

    // Delete user from Auth to remove matching doc from this collection

}
