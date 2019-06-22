// user.model.ts

export class UserProfile {
    uid: number | string;

    birthDate: Date;

    constructor(
        uid: string, birthDate: string
    ) {
        this.uid = uid;
        this.birthDate = new Date(birthDate);
    }

    private dateFields = [
        'birthDate'
    ];

    reviver(key: string, value: string): any {
        if (this.dateFields.indexOf(key) > -1) {
            return new Date(value);
        } else {
            return value;
        }
    }

    toJSON() {
        return {
            uid: this.uid,
            birthDate: this.birthDate.toISOString
        };
    }
}
