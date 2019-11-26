import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorksComponent } from './pages/works/works.component';
import { NovelAddComponent } from './pages/novel-add/novel-add.component';
import { NovelWorkComponent } from './pages/novel-work/novel-work.component';
import { ChapterAddComponent } from './pages/chapter-add/chapter-add.component';

const routes: Routes = [
  { path: '', component: WorksComponent},
  { path: 'novel-add', component: NovelAddComponent},
  { path: 'novel/:novelID', component: NovelWorkComponent},
  { path: 'novel/:novelID/chapter-add', component: ChapterAddComponent},
  { path: 'novel/:novelID/:chapterID/edit', component: ChapterAddComponent}, // Editing chapter
  { path: 'novel/:novelID/:chapterID', component: ChapterAddComponent}, // Change to View Comments, etc.
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkshopRoutingModule { }
