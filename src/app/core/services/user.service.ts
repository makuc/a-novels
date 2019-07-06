import { keysConfig, dbKeysConfig } from 'src/app/keys.config';
import { Injectable, OnInit } from '@angular/core';
import { User, auth } from 'firebase/app';
import { UserProfile } from 'src/app/shared/models/user-profile.model';

import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { first } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {
    /* tslint:disable: variable-name */
    private _user: User;
    private _userProfile: AngularFirestoreDocument<UserProfile>;
    private usersCollection: AngularFirestoreCollection<UserProfile>;
    /* tslink:enable: variable-name */

    get user$(): Observable<UserProfile> {
        return this._userProfile.valueChanges();
    }

    // Implementation
    constructor(
        private authService: AngularFireAuth,
        private afStore: AngularFirestore
    ) {
        this.authService.user.pipe(first()).subscribe(user => {
            this._user = user;
        });
        this._userProfile = this.afStore.doc<UserProfile>('users/FhbJpOsFtiYlunrc5PDqKKw17jl2');
    }

    private createProfile(birthDate: Date) {
        this.usersCollection = this.afStore.collection<UserProfile>(dbKeysConfig.COLLECTION_USERS);
    }

    getAll() {
        return;
    }

    delete(id: number) {
        return;
    }
}
