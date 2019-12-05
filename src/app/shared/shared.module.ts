import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { E404Component } from './pages/e404/e404.component';
import { AlertComponent } from './components/alert/alert.component';
import { TextEditorComponent } from './components/text-editor/text-editor.component';
import { MaterialModule } from '../core/imports/material.module';
import { FileSelectComponent } from './components/file-select/file-select.component';
import { RatingSelectorComponent } from './components/rating-selector/rating-selector.component';
import { RenderReviewComponent } from './components/render-review/render-review.component';
import { RouterModule } from '@angular/router';
import { DisplayRatingComponent } from './components/display-rating/display-rating.component';
import { RatingsComponent } from './components/ratings/ratings.component';
import { ScrollGlobalDirective } from './directives/scroll-global.directive';
import { ObserveStickyDirective } from './directives/observe-sticky.directive';
import { ObserveStickyFooterDirective } from './directives/observe-sticky-footer.directive';
import { MinimizeBtnDirective } from './directives/minimize-btn.directive';
import { IconComponent } from './components/icon/icon.component';
import { BtnDirective } from './directives/btn.directive';
import { ListReviewsComponent } from './components/list-reviews/list-reviews.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule
  ],
  declarations: [
    E404Component,
    AlertComponent,
    TextEditorComponent,
    FileSelectComponent,
    RatingSelectorComponent,
    RenderReviewComponent,
    ListReviewsComponent,
    DisplayRatingComponent,
    RatingsComponent,
    IconComponent,
    BtnDirective,

    ScrollGlobalDirective,
    ObserveStickyDirective,
    ObserveStickyFooterDirective,
    MinimizeBtnDirective
  ],
  exports: [
    E404Component,
    AlertComponent,
    TextEditorComponent,
    FileSelectComponent,
    RatingSelectorComponent,
    RenderReviewComponent,
    ListReviewsComponent,
    DisplayRatingComponent,
    RatingsComponent,
    IconComponent,
    BtnDirective,

    ScrollGlobalDirective,
    ObserveStickyDirective,
    ObserveStickyFooterDirective,
    MinimizeBtnDirective
  ]
})
export class SharedModule { }
