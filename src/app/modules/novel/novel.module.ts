import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NovelRoutingModule } from './novel-routing.module';
import { DetailsComponent } from './pages/details/details.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FullStatisticComponent } from './components/full-statistic/full-statistic.component';
import { RatingsComponent } from './components/ratings/ratings.component';
import { TocComponent } from './components/toc/toc.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/core/imports/material.module';


@NgModule({
  imports: [
    CommonModule,
    NovelRoutingModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  declarations: [
    DetailsComponent,
    FullStatisticComponent,
    RatingsComponent,

    TocComponent
  ],
  exports: [
    RatingsComponent
  ]
})
export class NovelModule { }
