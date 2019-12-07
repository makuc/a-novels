import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailsComponent } from './pages/details/details.component';
import { ReviewComponent } from './pages/review/review.component';
import { ChapterComponent } from './pages/chapter/chapter.component';
import {
  CustomAngularFireAuthGuard,
  redirectUnauthorizedTo
} from 'src/app/core/guards/auth.guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);

const routes: Routes = [
  {
    path: '',
    redirectTo: 'create',
    pathMatch: 'full'
  },
  {
    path: ':novelID',
    component: DetailsComponent
  },
  {
    path: ':novelID/review',
    component: ReviewComponent,
    canActivate: [CustomAngularFireAuthGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin
    }
  },
  {
    path: ':novelID/:chapterID',
    component: ChapterComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NovelRoutingModule { }
