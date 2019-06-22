import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './imports/material.import';

import { NovelRoutingModule } from './novel-routing.module';
import { DetailsComponent } from './pages/details/details.component';
import { CreateComponent } from './pages/create/create.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FullStatisticComponent } from './components/full-statistic/full-statistic.component';
import { RatingsComponent } from './components/ratings/ratings.component';
import { TocComponent } from './components/toc/toc.component';


@NgModule({
  imports: [
    CommonModule,
    NovelRoutingModule,
    MaterialModule,
    FlexLayoutModule
  ],
  declarations: [
    DetailsComponent,
    FullStatisticComponent,
    RatingsComponent,

    CreateComponent,

    TocComponent
  ]
})
export class NovelModule { }
