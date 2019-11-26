import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { MyHammerConfig } from 'src/app/shared/configs/hammerjs.config';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './imports/material.module';
import { FirebaseModule } from './imports/firebase.module';

// Config
import { environment } from 'src/environments/environment';

// Header
import { HeaderComponent } from './components/header/header.component';
import { HeadbarComponent } from './components/header/headbar/headbar.component';
import { UserpaneComponent } from './components/header/userpane/userpane.component';
import { NgMatSearchBarModule } from './components/header/search-bar/ng-mat-search-bar.module';
// Footer
import { FooterComponent } from './components/footer/footer.component';
// Sidenav
import { SidenavComponent } from './components/sidenav/sidenav.component';
// Shortcuts
import { ShortcutsComponent } from './components/shortcuts/shortcuts.component';
import { BottomSheetComponent } from './components/shortcuts/bottom-sheet/bottom-sheet.component';

// Other
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { ErrorHandlerInterceptor } from './interceptors/error-handler.interceptor';
import { AppSettingsService } from './services/app-settings.service';
import { AlertService } from './services/alert.service';

import { LoginComponent } from './authentication/pages/login/login.component';
import { RegisterComponent } from './authentication/pages/register/register.component';
import { NovelService } from './services/novel.service';
import { UserService } from './services/user.service';
import { GenresService } from './services/genres.service';
import { LibraryService } from './services/library.service';
import { HistoryService } from './services/history.service';
import { ChaptersService } from './services/chapters.service';
import { ReviewsService } from './services/reviews.service';
import { LikesService } from './services/likes.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    BrowserAnimationsModule,
    MaterialModule,
    FirebaseModule,

    NgMatSearchBarModule
  ],
  providers: [
    { provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig },
    AppSettingsService,
    AlertService,
    // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorHandlerInterceptor, multi: true },
    UserService,
    LikesService,
    NovelService,
    HistoryService,
    GenresService,
    LibraryService,
    ChaptersService,
    ReviewsService
  ],
  declarations: [
    HeaderComponent,
    HeadbarComponent,
    UserpaneComponent,

    FooterComponent,

    SidenavComponent,

    ShortcutsComponent,
    BottomSheetComponent,

    LoginComponent,
    RegisterComponent
  ],
  entryComponents: [
    BottomSheetComponent
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    ShortcutsComponent,

    LoginComponent,
    RegisterComponent,

    SidenavComponent
  ]
})
export class CoreModule { }
