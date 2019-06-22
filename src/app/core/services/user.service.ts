import { keysConfig } from 'src/app/keys.config';
import { Injectable, OnInit } from '@angular/core';
import { User, auth } from 'firebase/app';
import { UserProfile } from 'src/app/shared/models/user-profile.model';

import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class UserService {
    /* tslint:disable: variable-name */
    private _user: User;
    private _userProfile: AngularFirestoreDocument<UserProfile>;
    /* tslink:enable: variable-name */

    public userProfile: Observable<UserProfile | null>;

    constructor(
        private authService: AngularFireAuth,
        private afStore: AngularFirestore
    ) {
        this.authService.user.subscribe(user => {
            this._user = user;
        });
        this.userProfile = this.afStore.doc('users/FhbJpOsFtiYlunrc5PDqKKw17jl2').valueChanges() as Observable<UserProfile | null>;
    }

    private createProfile(uid: string, birthDate: Date) {

    }

    getAll() {
        return;
    }

    delete(id: number) {
        return;
    }
}
