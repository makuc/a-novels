// user.model.ts

export interface AuthProvier {
    name: string;
    token: string;
}

export class UserProfile {
    uid: string;
    created: firebase.firestore.Timestamp;
    birthDate?: firebase.firestore.Timestamp;

    constructor(
        uid: string
    ) {
        this.uid = uid;
    }

    private dateFields = [
        'birthDate'
    ];

    reviver(key: string, value: string): any {
        if (this.dateFields.indexOf(key) > -1) {
            if (value) {
                return new Date(value);
            }
        }
        return value;
    }
}
