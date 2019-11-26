import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsComponent } from './pages/details/details.component';
import { canActivate } from '@angular/fire/auth-guard';
import { redirectUnauthorizedToLogin } from 'src/app/core/guards/const-def.guard';
import { ReviewComponent } from './pages/review/review.component';
import { ChapterComponent } from './pages/chapter/chapter.component';

const routes: Routes = [
  { path: '', redirectTo: 'create', pathMatch: 'full' },
  { path: ':novelID', component: DetailsComponent },
  { path: ':novelID/review', component: ReviewComponent, ...canActivate(redirectUnauthorizedToLogin) },
  { path: ':novelID/:chapterID', component: ChapterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NovelRoutingModule { }
