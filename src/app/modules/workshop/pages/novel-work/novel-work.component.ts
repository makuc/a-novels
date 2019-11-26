import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Novel } from 'src/app/shared/models/novels/novel.model';
import { NovelService } from 'src/app/core/services/novel.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { storageKeys } from 'src/app/keys.config';
import { EditInputComponent } from '../../components/edit-input/edit-input.component';
import { EditTXEComponent } from '../../components/edit-txe/edit-txe.component';
import { Genre } from 'src/app/shared/models/novels/genre.model';
import { EditGenresComponent } from '../../components/edit-genres/edit-genres.component';
import { EditTagsComponent } from '../../components/edit-tags/edit-tags.component';
import { Chapter } from 'src/app/shared/models/novels/chapter.model';
import { ChaptersService } from 'src/app/core/services/chapters.service';

@Component({
  selector: 'app-novel-work',
  templateUrl: './novel-work.component.html',
  styleUrls: ['./novel-work.component.scss']
})
export class NovelWorkComponent implements OnInit {

  s = storageKeys;

  novel: Observable<Novel>;
  togglingPublic = false;

  constructor(
    private novels: NovelService,
    private route: ActivatedRoute,
    public dialog: MatDialog
  ) {
    this.novel = this.route.paramMap
      .pipe(
        switchMap(params => this.novels.novelGet(params.get('novelID')))
      );
  }

  ngOnInit() {
  }

  openEditTitle(id: string, title: string) {
    const dialogRef = this.dialog.open(EditInputComponent, {
      width: '340px',
      disableClose: true,
      data: {
        value: title,
        placeholder: 'Title'
      }
    });

    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.novels.novelTitleEdit(id, value).catch(
          (err) => console.log('Edit title:', err)
        );
      }
    });
  }

  openEditDescription(id: string, description: string) {
    const dialogRef = this.dialog.open(EditTXEComponent, {
      width: '600px',
      disableClose: true,
      data: {
        value: description,
        placeholder: 'Description'
      }
    });

    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.novels.novelDescriptionEdit(id, value).catch(
          (err) => console.log('Edit description:', err)
        );
      }
    });
  }

  openEditTags(id: string, tags: string) {
    const dialogRef = this.dialog.open(EditTagsComponent, {
      width: '600px',
      disableClose: true,
      data: {
        value: tags,
        placeholder: 'Tags'
      }
    });

    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.novels.novelTagsEdit(id, value).catch(
          (err) => console.log('Edit tags:', err)
        );
      }
    });
  }

  openEditGenres(id: string, genres: Genre[]) {
    const dialogRef = this.dialog.open(EditGenresComponent, {
      width: '600px',
      disableClose: true,
      data: {
        value: genres,
        placeholder: 'Genres'
      }
    });

    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.novels.novelGenresEdit(id, value).catch(
          (err) => console.log('Edit genre:', err)
        );
      }
    });
  }

  togglePublic(id: string, currentValue: boolean) {
    this.togglingPublic = true;
    this.novels.novelPublicToggle(id, currentValue).then(
      () => this.togglingPublic = false,
      (err) => console.log('Toggle public:', err)
    );
  }

  removeTag(id: string, tag: string) {
    this.novels.novelTagRemove(id, tag).catch(
      (err) => console.error('Remove tag:', err)
    );
  }

}
