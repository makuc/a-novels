import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { ProfileOverviewComponent } from './pages/profile-overview/profile-overview.component';
import { ProfileReviewsComponent } from './pages/profile-reviews/profile-reviews.component';
import { ProfileReadingHistoryComponent } from './pages/profile-reading-history/profile-reading-history.component';
import { ProfileFavoritesComponent } from './pages/profile-favorites/profile-favorites.component';
import { ProfileWorksComponent } from './pages/profile-works/profile-works.component';

const routes: Routes = [
    {
        path: ':uid',
        component: ProfileOverviewComponent
    },
    {
        path: 'me/edit',
        component: EditProfileComponent
    },
    {
      path: ':uid/works',
      component: ProfileWorksComponent
    },
    {
        path: ':uid/reviews',
        component: ProfileReviewsComponent
    },
    {
        path: ':uid/favorites',
        component: ProfileFavoritesComponent
    },
    {
        path: ':uid/reading-history',
        component: ProfileReadingHistoryComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [ ]
})
export class UserRoutingModule { }
