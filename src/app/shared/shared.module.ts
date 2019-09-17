import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { E404Component } from './pages/e404/e404.component';
import { AlertComponent } from './components/alert/alert.component';
import { TextEditorComponent } from './components/text-editor/text-editor.component';
import { MaterialModule } from '../core/imports/material.module';
import { ScrollPositionDirective } from './directives/scroll-position.directive';
import { FileSelectComponent } from './components/file-select/file-select.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
  ],
  declarations: [
    E404Component,
    AlertComponent,
    TextEditorComponent,
    ScrollPositionDirective,
    FileSelectComponent
  ],
  exports: [
    E404Component,
    AlertComponent,
    TextEditorComponent,
    ScrollPositionDirective,
    FileSelectComponent
  ]
})
export class SharedModule { }
