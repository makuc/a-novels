import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { UserProfile } from 'src/app/shared/models/user-profile.model';

@Injectable()
export class UserResolver implements Resolve<UserProfile> {

    constructor(
        private userService: UserService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UserProfile> {
        if (!route.params.uid || route.params.uid === 'me') {
            return this.userService
                .currentUser
                .pipe(take(1));
        } else {
            return this.userService
                .getUser(route.params.uid)
                .pipe(take(1));
        }
    }
}
