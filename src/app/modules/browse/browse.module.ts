import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrowseRoutingModule } from './browse-routing.module';
import { BrowseComponent } from './pages/browse/browse.component';
import { MaterialModule } from 'src/app/core/imports/material.module';
import { NovelModule } from '../novel/novel.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    BrowseRoutingModule,

    MaterialModule,
    NovelModule,
    SharedModule
  ],
  declarations: [
    BrowseComponent
  ]
})
export class BrowseModule { }
