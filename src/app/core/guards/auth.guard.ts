import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, switchMap, take } from 'rxjs/operators';
import { Observable, UnaryFunction, pipe, of } from 'rxjs';
import { User } from 'firebase';
import { keysConfig } from 'src/app/keys.config';
import { AngularFireAuth } from '@angular/fire/auth';

export type AuthPipeGenerator = (next: ActivatedRouteSnapshot, state: RouterStateSnapshot) => AuthPipe;
export type AuthPipe = UnaryFunction<Observable<User | null>, Observable<boolean | any[]>>;


export const loggedIn: AuthPipe = map(user => !!user);
export const isNotAnonymous: AuthPipe = map(user => !!user && !user.isAnonymous);
export const idTokenResult = switchMap((user: User | null) => user ? user.getIdTokenResult() : of(null));
export const emailVerified: AuthPipe = map(user => !!user && user.emailVerified);
export const customClaims = pipe(idTokenResult, map(tokenResult => tokenResult ? tokenResult.claims : []));
export const hasCustomClaim = (claim: string) => pipe(customClaims, map(claims => claims.hasOwnProperty(claim)));
export const redirectUnauthorizedTo = (redirect: any[]) => pipe(loggedIn, map(user => user || redirect));
export const redirectLoggedInTo = (redirect: any[]) => pipe(loggedIn, map(user => user && redirect || true));

@Injectable()
export class CustomAngularFireAuthGuard implements CanActivate {

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const authPipeFactory: AuthPipeGenerator = route.data.authGuardPipe || (() => loggedIn);

    const queryParams = {
      [keysConfig.RETURN_URL_KEY]: state.url
    };
    return this.afAuth.user.pipe(
      take(1),
      authPipeFactory(route, state),
      map(nextStep => typeof nextStep === 'boolean' ? nextStep : this.router.createUrlTree(nextStep, { queryParams }))
    );
  }

  private loggedIn(user: User) {
    if (user) { return true; }

    const queryParams = {
      [keysConfig.RETURN_URL_KEY]: this.router.url
    };
    this.router.navigate(['login'], { queryParams });
    return false;
  }
}

export const canActivate = (usePipe: AuthPipe | AuthPipeGenerator) => ({
  canActivate: [CustomAngularFireAuthGuard], data: { authGuardPipe: usePipe.name === '' ? pipe : () => pipe }
});
