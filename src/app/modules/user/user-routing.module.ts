import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { canActivate } from '@angular/fire/auth-guard';

import { redirectUnauthorizedToLogin } from 'src/app/core/guards/const-def.guard';

import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { ProfileOverviewComponent } from './pages/profile-overview/profile-overview.component';
import { UserResolver } from './resolvers/user.resolver';

const routes: Routes = [
    {
        path: ':uid',
        component: ProfileOverviewComponent,
        resolve: {
            user: UserResolver
        },
        ...canActivate(redirectUnauthorizedToLogin)
    },
    { path: 'me/edit', component: EditProfileComponent, ...canActivate(redirectUnauthorizedToLogin) }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [
        UserResolver
    ]
})
export class UserRoutingModule { }
