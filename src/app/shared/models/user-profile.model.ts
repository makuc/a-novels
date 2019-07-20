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

    constructor(
        data: any
    ) {
        this.uid = data.uid;
        this.displayName = data.displayName;
        this.email = data.email;
        this.emailVerified = data.emailVerified;
        this.phoneNumber = data.phoneNumber;
        this.photoURL = data.photoURL;
        this.createdAt = data.createdAt;
        this.birthday = data.birthday;
    }
/*
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
