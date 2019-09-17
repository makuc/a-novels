import { ValidatorFn, AbstractControl } from '@angular/forms';

export class ArrayValidators {
    static required(control: AbstractControl): {[ key: string ]: boolean} | null {
        if (control.value.length > 0) {
            return null;
        } else {
            return { required: true };
        }
    }
}
