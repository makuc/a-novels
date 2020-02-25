import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { E404Component } from './shared/pages/e404/e404.component';
import { LoginComponent } from './core/authentication/pages/login/login.component';
import { ResetPasswordComponent } from './core/authentication/pages/reset-password/reset-password.component';
import { RegisterComponent } from './core/authentication/pages/register/register.component';
import {
  CustomAngularFireAuthGuard,
  redirectUnauthorizedTo,
  redirectLoggedInTo
} from './core/guards/auth.guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToLibrary = () => redirectLoggedInTo(['library']);

const routes: Routes = [
  {
    path: '',
    redirectTo: 'browse',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [CustomAngularFireAuthGuard],
    data: {
      authGuardPipe: redirectLoggedInToLibrary
    }
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [CustomAngularFireAuthGuard],
    data: {
      authGuardPipe: redirectLoggedInToLibrary
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [CustomAngularFireAuthGuard],
    data: {
      authGuardPipe: redirectLoggedInToLibrary
    }
  },
  {
    path: 'home',
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'novel',
    loadChildren: () => import('./modules/novel/novel.module').then(m => m.NovelModule)
  },
  {
    path: 'user',
    loadChildren: () => import('./modules/user/user.module').then(m => m.UserModule),
    canActivate: [CustomAngularFireAuthGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin
    }
  },
  {
    path: 'browse',
    loadChildren: () => import('./modules/browse/browse.module').then(m => m.BrowseModule)
  },
  {
    path: 'workshop',
    loadChildren: () => import('./modules/workshop/workshop.module').then(m => m.WorkshopModule),
    canActivate: [CustomAngularFireAuthGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin
    }
  },
  {
    path: 'library',
    loadChildren: () => import('./modules/library/library.module').then(m => m.LibraryModule),
    canActivate: [CustomAngularFireAuthGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin
    }
  },
  // Default
  { path: '**', component: E404Component }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
