import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { E404Component } from './pages/e404/e404.component';
import { AlertComponent } from './components/alert/alert.component';
import { TextEditorComponent } from './components/text-editor/text-editor.component';
import { MaterialModule } from '../core/imports/material.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: [
    E404Component,
    AlertComponent,
    TextEditorComponent
  ],
  exports: [
    E404Component,
    AlertComponent,
    TextEditorComponent
  ]
})
export class SharedModule { }
