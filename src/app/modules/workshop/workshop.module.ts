import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorksComponent } from './pages/works/works.component';
import { NovelAddComponent } from './pages/novel-add/novel-add.component';
import { WorkshopRoutingModule } from './workshop-routing.module';
import { MaterialModule } from 'src/app/core/imports/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { TagsSelectorComponent } from './components/tags-selector/tags-selector.component';


@NgModule({
  imports: [
    CommonModule,
    WorkshopRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule
  ],
  declarations: [
    WorksComponent,
    NovelAddComponent,
    TagsSelectorComponent
  ]
})
export class WorkshopModule { }
