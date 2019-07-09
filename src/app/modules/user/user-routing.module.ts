import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { canActivate } from '@angular/fire/auth-guard';

import { redirectUnauthorizedToLogin } from 'src/app/core/guards/const-def.guard';

import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { ProfileOverviewComponent } from './pages/profile-overview/profile-overview.component';
import { UserResolver } from './resolvers/user.resolver';
import { ProfileArchiveComponent } from './pages/profile-archive/profile-archive.component';
import { ProfileWorkshopComponent } from './pages/profile-workshop/profile-workshop.component';
import { ProfileReviewsComponent } from './pages/profile-reviews/profile-reviews.component';
import { ProfileReadingHistoryComponent } from './pages/profile-reading-history/profile-reading-history.component';
import { ProfileFavoritesComponent } from './pages/profile-favorites/profile-favorites.component';

const routes: Routes = [
    {
        path: ':uid',
        component: ProfileOverviewComponent,
        resolve: {
            user: UserResolver
        },
        ...canActivate(redirectUnauthorizedToLogin)
    },
    {
        path: 'me/edit',
        component: EditProfileComponent,
        resolve: {
            user: UserResolver
        },
        ...canActivate(redirectUnauthorizedToLogin)
    },
    {
        path: ':uid/archive',
        component: ProfileArchiveComponent,
        resolve: {
            user: UserResolver
        },
        ...canActivate(redirectUnauthorizedToLogin)
    },
    {
        path: ':uid/workshop',
        component: ProfileWorkshopComponent,
        resolve: {
            user: UserResolver
        },
        ...canActivate(redirectUnauthorizedToLogin)
    },
    {
        path: ':uid/reviews',
        component: ProfileReviewsComponent,
        resolve: {
            user: UserResolver
        },
        ...canActivate(redirectUnauthorizedToLogin)
    },
    {
        path: ':uid/reading-history',
        component: ProfileReadingHistoryComponent,
        resolve: {
            user: UserResolver
        },
        ...canActivate(redirectUnauthorizedToLogin)
    },
    {
        path: ':uid/favorites',
        component: ProfileFavoritesComponent,
        resolve: {
            user: UserResolver
        },
        ...canActivate(redirectUnauthorizedToLogin)
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [
        UserResolver
    ]
})
export class UserRoutingModule { }
