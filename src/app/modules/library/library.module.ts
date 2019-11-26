import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryRoutingModule } from './library-routing.module';
import { LibraryComponent } from './pages/library/library.component';
import { MaterialModule } from 'src/app/core/imports/material.module';
import { LibNovelComponent } from './components/lib-novel/lib-novel.component';

@NgModule({
  imports: [
    CommonModule,
    LibraryRoutingModule,
    MaterialModule
  ],
  declarations: [
    LibraryComponent,
    LibNovelComponent
  ]
})
export class LibraryModule { }
