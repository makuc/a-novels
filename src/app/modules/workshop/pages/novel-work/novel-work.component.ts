import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Novel } from 'src/app/shared/models/novels/novel.model';
import { NovelService } from 'src/app/core/services/novel.service';
import { ActivatedRoute, Router } from '@angular/router';
import { storageKeys } from 'src/app/keys.config';
import { EditInputComponent } from '../../components/edit-input/edit-input.component';
import { EditTXEComponent } from '../../components/edit-txe/edit-txe.component';
import { Genre } from 'src/app/shared/models/novels/genre.model';
import { EditGenresComponent } from '../../components/edit-genres/edit-genres.component';
import { EditTagsComponent } from '../../components/edit-tags/edit-tags.component';

@Component({
  selector: 'app-novel-work',
  templateUrl: './novel-work.component.html',
  styleUrls: ['./novel-work.component.scss']
})
export class NovelWorkComponent implements OnInit {

  s = storageKeys;

  novelID: string;
  novel$: Observable<Novel>;
  togglingPublic = false;

  constructor(
    private ns: NovelService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.novelID = this.route.snapshot.paramMap.get('novelID');
    this.novel$ = this.ns.novelGet(this.novelID);
  }

  openEditTitle(title: string) {
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
        this.ns.novelTitleEdit(this.novelID, value).catch(
          (err) => console.log('Edit title:', err)
        );
      }
    });
  }

  openEditDescription(description: string) {
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
        this.ns.novelDescriptionEdit(this.novelID, value).catch(
          (err) => console.log('Edit description:', err)
        );
      }
    });
  }

  openEditTags(tags: string) {
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
        this.ns.novelTagsEdit(this.novelID, value).catch(
          (err) => console.log('Edit tags:', err)
        );
      }
    });
  }

  openEditGenres(genres: Genre[]) {
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
        this.ns.novelGenresEdit(this.novelID, value).catch(
          (err) => console.log('Edit genre:', err)
        );
      }
    });
  }

  togglePublic(currentValue: boolean) {
    this.togglingPublic = true;
    this.ns.novelPublicToggle(this.novelID, currentValue).then(
      () => this.togglingPublic = false,
      (err) => console.log('Toggle public:', err)
    );
  }

  removeTag(tag: string) {
    this.ns.novelTagRemove(this.novelID, tag).catch(
      (err) => console.error('Remove tag:', err)
    );
  }

  deleteNovel(curPublic: boolean) {
    this.ns.novelRemove(this.novelID, curPublic).then(
      () => this.router.navigate(['workshop']),
      err => console.log(err)
    );
  }

}
