// user.model.ts

export class UserMeta {
    uid: string;
    displayName: string;

    constructor(uid: string, displayName?: string) {
      this.uid = uid;
      this.displayName = displayName;
    }
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
}
