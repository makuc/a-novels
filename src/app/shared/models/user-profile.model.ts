// user.model.ts

export interface AuthProvier {
    name: string;
    token: string;
}

export class UserProfile {
    uid: string;
    displayName: string;
    email?: string;
    emailVerified?: boolean;
    phoneNumber?: string;
    photoURL?: string;

    createdAt: firebase.firestore.Timestamp;
    birthday?: firebase.firestore.Timestamp;

/*
    constructor(
        uid: string
    ) {
        this.uid = uid;
    }

    private dateFields = [
        'birthday'
    ];

    reviver(key: string, value: string): any {
        if (this.dateFields.indexOf(key) > -1) {
            if (value) {
                return new Date(value);
            }
        }
        return value;
    }
*/
}
