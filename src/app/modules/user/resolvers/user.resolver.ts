import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';
import { User } from 'firebase';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable()
export class UserResolver implements Resolve<any> {

    constructor(
        private userService: UserService,
        private authService: AuthenticationService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
        if (route.params.uid === 'me') {
            return this.authService.getUser.pipe(take(1));
        } else {
            console.log('UserResolver, update to match actual user!');
            return new Observable<User>();
            // return this.userService.getUser(route.paramMap.get('uid'));
        }
    }
}
