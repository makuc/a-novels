import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowseRoutingModule } from './browse-routing.module';
import { BrowseComponent } from './pages/browse/browse.component';
import { MaterialModule } from 'src/app/core/imports/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { GenreSelectorComponent } from './components/genre-selector/genre-selector.component';

@NgModule({
  imports: [
    CommonModule,
    BrowseRoutingModule,

    MaterialModule,
    SharedModule
  ],
  declarations: [
    BrowseComponent,
    GenreSelectorComponent
  ]
})
export class BrowseModule { }
