import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { canActivate } from '@angular/fire/auth-guard';
import { redirectUnauthorizedToLogin } from 'src/app/core/guards/const-def.guard';
import { LibraryComponent } from './pages/library/library.component';

const routes: Routes = [
  {
    path: '',
    component: LibraryComponent,
    ...canActivate(redirectUnauthorizedToLogin)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LibraryRoutingModule { }
