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
    ProfileOverviewComponent
  ],
  exports: [
    EditProfileComponent,
    ProfileOverviewComponent
  ]
})
export class UserModule { }
