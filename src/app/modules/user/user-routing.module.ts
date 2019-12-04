import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileOverviewComponent } from './pages/profile-overview/profile-overview.component';
import { ProfileReviewsComponent } from './pages/profile-reviews/profile-reviews.component';
import { ProfileWorksComponent } from './pages/profile-works/profile-works.component';

const routes: Routes = [
    {
        path: ':uid',
        component: ProfileOverviewComponent
    },
    {
      path: ':uid/works',
      component: ProfileWorksComponent
    },
    {
        path: ':uid/reviews',
        component: ProfileReviewsComponent
    }, /*
    {
        path: ':uid/favorites',
        component: ProfileFavoritesComponent
    },
    {
        path: ':uid/reading-history',
        component: ProfileReadingHistoryComponent
    },*/
    {
      path: '**',
      redirectTo: '/me',
      pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [ ]
})
export class UserRoutingModule { }
