import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsComponent } from './pages/details/details.component';
import { canActivate } from '@angular/fire/auth-guard';
import { redirectUnauthorizedToLogin } from 'src/app/core/guards/const-def.guard';

const routes: Routes = [
  { path: '', redirectTo: 'create', pathMatch: 'full' },
  { path: ':id', component: DetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NovelRoutingModule { }
