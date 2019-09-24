import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LibraryComponent } from './library.component';

import { LibraryRoutingModule } from './library-routing.module';

@NgModule({
  imports: [
    CommonModule,
    LibraryRoutingModule
  ],
  declarations: [
    LibraryComponent
  ]
})
export class LibraryModule { }
