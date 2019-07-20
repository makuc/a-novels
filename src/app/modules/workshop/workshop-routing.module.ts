import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorksComponent } from './pages/works/works.component';
import { NovelAddComponent } from './pages/novel-add/novel-add.component';

const routes: Routes = [
  { path: '', component: WorksComponent},
  { path: 'novel-add', component: NovelAddComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkshopRoutingModule { }
