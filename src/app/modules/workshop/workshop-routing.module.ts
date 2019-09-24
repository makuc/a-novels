import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorksComponent } from './pages/works/works.component';
import { NovelAddComponent } from './pages/novel-add/novel-add.component';
import { NovelWorkComponent } from './pages/novel-work/novel-work.component';
import { ChapterAddComponent } from './pages/chapter-add/chapter-add.component';

const routes: Routes = [
  { path: '', component: WorksComponent},
  { path: 'novel-add', component: NovelAddComponent},
  { path: 'novel/:novelId', component: NovelWorkComponent},
  { path: 'novel/:novelId/chapter-add', component: ChapterAddComponent},
  { path: 'novel/:novelId/:chapterId/edit', component: ChapterAddComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkshopRoutingModule { }
