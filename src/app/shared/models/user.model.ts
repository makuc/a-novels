// user.model.ts

export class User {
    id: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    token: string;

    reviver(key: string, value: string): any {
        // key == 'created' ? new Date(value) : value;
        // typeof value === 'number' ? value * 2 : value;
    }

    toJSON() {
        return {
            Id: this.id,
            Email: this.email
        };
    }
}
