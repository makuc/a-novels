import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './pages/profile/profile.component';
import { canActivate } from '@angular/fire/auth-guard';

import { redirectUnauthorizedToLogin } from 'src/app/core/guards/const-def.guard';

const routes: Routes = [
    { path: 'me', component: ProfileComponent, ...canActivate(redirectUnauthorizedToLogin) }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule { }
