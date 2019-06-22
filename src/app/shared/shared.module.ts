import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { E404Component } from './pages/e404/e404.component';
import { AlertComponent } from './components/alert/alert.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    E404Component,
    AlertComponent
  ],
  exports: [
    E404Component,
    AlertComponent
  ]
})
export class SharedModule { }
