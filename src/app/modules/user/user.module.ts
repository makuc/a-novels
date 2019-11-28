import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/core/imports/material.module';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { ProfileOverviewComponent } from './pages/profile-overview/profile-overview.component';
import { ProfileNavComponent } from './components/profile-nav/profile-nav.component';
import { ProfileHeaderComponent } from './components/profile-header/profile-header.component';
import { ProfileReviewsComponent } from './pages/profile-reviews/profile-reviews.component';
import { ProfileReadingHistoryComponent } from './pages/profile-reading-history/profile-reading-history.component';
import { ProfileFavoritesComponent } from './pages/profile-favorites/profile-favorites.component';
import { ProfileWorksComponent } from './pages/profile-works/profile-works.component';
import { PReviewsComponent } from './components/p-review/p-reviews.component';
import { PNovelsComponent } from './components/p-novels/p-novels.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UserRoutingModule,

    MaterialModule,
    SharedModule
  ],
  declarations: [
    EditProfileComponent,

    ProfileHeaderComponent,
    ProfileNavComponent,

    ProfileOverviewComponent,

    ProfileReviewsComponent,
    PReviewsComponent,

    ProfileReadingHistoryComponent,
    ProfileFavoritesComponent,

    ProfileWorksComponent,
    PNovelsComponent
  ],
  exports: [
    EditProfileComponent,
    ProfileOverviewComponent
  ]
})
export class UserModule { }
