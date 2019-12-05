import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GenresService } from 'src/app/core/services/genres.service';
import { Genre } from 'src/app/shared/models/novels/genre.model';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ArrayValidators } from 'src/app/shared/validators/array.validators';
import { MatChipList } from '@angular/material/chips';

export interface DataInput {
  value: Genre[];
  placeholder: string;
}

@Component({
  selector: 'app-edit-genres',
  templateUrl: './edit-genres.component.html',
  styleUrls: ['./edit-genres.component.scss']
})
export class EditGenresComponent {

  genresList: Observable<Genre[]>;
  ctrl: FormControl;
  @ViewChild('selGenre') genreSelector: MatChipList;

  constructor(
    public dialogRef: MatDialogRef<EditGenresComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataInput,
    private genres: GenresService
  ) {
    this.genresList = this.genres.get();
    this.ctrl = new FormControl(([...this.data.value]), ArrayValidators.required);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  toggleGenre(genre: Genre) {
    const val: Genre[] = this.ctrl.value;
    const i = this.genreComparisonIndex(val, genre);
    if (i < 0) {
      val.push(genre);
    } else {
      val.splice(i, 1);
    }
    this.genreSelector.writeValue(val);
    this.ctrl.updateValueAndValidity();
    this.ctrl.markAsDirty();
  }
  genreSelected(genre: Genre) {
    return this.genreComparisonIndex(this.ctrl.value, genre) > -1;
  }
  private genreComparisonIndex(arr: Genre[], genre: Genre) {
    for (let i = 0; i < arr.length; i++) {
      if  (arr[i].name.toLowerCase() === genre.name.toLowerCase()) {
        return i;
      }
    }
    return -1;
  }
  compareGenres(genre1: Genre, genre2: Genre): boolean {
    return genre1.name.toLowerCase() === genre2.name.toLowerCase();
  }
}
