import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NovelComponent } from './novel.component';

import { NovelRoutingModule } from './novel-routing.module';

@NgModule({
  imports: [
    CommonModule
  ,
    NovelRoutingModule],
  declarations: [NovelComponent]
})
export class NovelModule { }
