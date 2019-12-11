import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorksComponent } from './pages/works/works.component';
import { NovelAddComponent } from './pages/novel-add/novel-add.component';
import { WorkshopRoutingModule } from './workshop-routing.module';
import { MaterialModule } from 'src/app/core/imports/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { TagsSelectorComponent } from './components/tags-selector/tags-selector.component';
import { NovelWorkComponent } from './pages/novel-work/novel-work.component';
import { ChaptersWorkComponent } from './components/chapters-work/chapters-work.component';
import { ChapterAddComponent } from './pages/chapter-add/chapter-add.component';
import { EditInputComponent } from './components/edit-input/edit-input.component';
import { CoverReuploadComponent } from './components/cover-reupload/cover-reupload.component';
import { EditTXEComponent } from './components/edit-txe/edit-txe.component';
import { EditGenresComponent } from './components/edit-genres/edit-genres.component';
import { EditTagsComponent } from './components/edit-tags/edit-tags.component';
import { TagsSelectorAutocompleteComponent } from './components/tags-selector-autocomplete/tags-selector-autocomplete.component';
import { NovelEntryComponent } from './components/novel-entry/novel-entry.component';

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
    NovelEntryComponent,
    NovelAddComponent,
    TagsSelectorComponent,
    TagsSelectorAutocompleteComponent,
    NovelWorkComponent,
    ChaptersWorkComponent,
    ChapterAddComponent,
    EditInputComponent,
    EditTXEComponent,
    EditGenresComponent,
    EditTagsComponent,
    CoverReuploadComponent
  ],
  entryComponents: [
    EditInputComponent,
    EditTXEComponent,
    EditGenresComponent,
    EditTagsComponent
  ]
})
export class WorkshopModule { }
