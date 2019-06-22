import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { environment } from 'src/environments/environment';

// Firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
// import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule, AngularFireAuth } from '@angular/fire/auth';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
// import { AngularFireFunctionsModule } from '@angular/fire/functions';

@NgModule({
  imports: [
    CommonModule,
    // Firebase SDK
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireAuthGuardModule,
    AngularFirestoreModule
  ],
  declarations: [],
  exports: [
    AngularFireAuthModule,
    AngularFireAuthModule
  ]
})
export class FirebaseModule { }
