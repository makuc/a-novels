import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MaterialModule } from 'src/app/core/imports/material.module';
import { FirebaseModule } from 'src/app/core/imports/firebase.module';
import { EditProfileComponent } from './pages/edit-profile/edit-profile.component';
import { ProfileOverviewComponent } from './pages/profile-overview/profile-overview.component';
import { UserResolver } from './resolvers/user.resolver';
import { ProfileNavComponent } from './components/profile-nav/profile-nav.component';
import { ProfileHeaderComponent } from './components/profile-header/profile-header.component';
import { ProfileArchiveComponent } from './pages/profile-archive/profile-archive.component';
import { ProfileWorkshopComponent } from './pages/profile-workshop/profile-workshop.component';
import { ProfileReviewsComponent } from './pages/profile-reviews/profile-reviews.component';
import { ProfileReadingHistoryComponent } from './pages/profile-reading-history/profile-reading-history.component';
import { ProfileFavoritesComponent } from './pages/profile-favorites/profile-favorites.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UserRoutingModule,
    FlexLayoutModule,

    MaterialModule,
    FirebaseModule
  ],
  declarations: [
    EditProfileComponent,

    ProfileHeaderComponent,
    ProfileNavComponent,
    ProfileOverviewComponent,

    ProfileArchiveComponent,
    ProfileWorkshopComponent,
    ProfileReviewsComponent,
    ProfileReadingHistoryComponent,
    ProfileFavoritesComponent
  ],
  exports: [
    EditProfileComponent,
    ProfileOverviewComponent
  ]
})
export class UserModule { }
