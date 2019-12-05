import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NovelRoutingModule } from './novel-routing.module';
import { DetailsComponent } from './pages/details/details.component';
import { FullStatisticComponent } from './components/full-statistic/full-statistic.component';
import { TocComponent } from './components/toc/toc.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/core/imports/material.module';
import { ReviewComponent } from './pages/review/review.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChapterComponent } from './pages/chapter/chapter.component';
import { ChSeparatorComponent } from './components/ch-separator/ch-separator.component';


@NgModule({
  imports: [
    CommonModule,
    NovelRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
    DetailsComponent,
    FullStatisticComponent,
    TocComponent,

    ReviewComponent,

    ChapterComponent,
    ChSeparatorComponent
  ],
  exports: [ ]
})
export class NovelModule { }
