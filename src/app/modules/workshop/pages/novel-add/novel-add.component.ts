import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { GenresService } from 'src/app/core/services/genres.service';
import { Observable } from 'rxjs';
import { Genre } from 'src/app/shared/models/novels/genre.model';
import { ArrayValidators } from 'src/app/shared/validators/array.validators';
import { NovelService } from 'src/app/core/services/novel.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-novel-add',
  templateUrl: './novel-add.component.html',
  styleUrls: ['./novel-add.component.scss']
})
export class NovelAddComponent implements OnInit {
  fgroup: FormGroup;
  loading = false;
  submitted = false;
  genresList: Observable<Genre[]>;

  constructor(
    private fb: FormBuilder,
    private genres: GenresService,
    private novels: NovelService,
    private router: Router
  ) { }

  ngOnInit() {
    this.genresList = this.genres.get();
    this.fgroup = this.fb.group({
      title: ['', [Validators.required]],
      tags: [([]), [Validators.required]],
      description: ['', [Validators.required]],
      genres: [([]), ArrayValidators.required],
      public: [false],
      cover: [null]
    });
  }

  get form() {
    return this.fgroup.controls;
  }

  validateAllFormFields(formGroup: FormGroup) {         // {1}
    Object.keys(formGroup.controls).forEach(field => {  // {2}
      const control = formGroup.get(field);             // {3}
      if (control instanceof FormControl) {             // {4}
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {        // {5}
        this.validateAllFormFields(control);            // {6}
      }
    });
  }

  onSubmit() {
    this.submitted = true;

    this.validateAllFormFields(this.fgroup);

    // stop here if form is invalid
    if (this.fgroup.invalid) {
      return;
    }
    this.loading = true;

    this.novels.novelAdd({
      title: this.form.title.value,
      description: this.form.description.value,
      genres: this.form.genres.value,
      tags: this.form.tags.value,
      public: this.form.public.value
    }).then(
      id => {
        if (this.form.cover.value && this.form.cover.value.length > 0) {
          this.uploadCover(id, this.form.cover.value[0]);
        } else {
          this.router.navigate([`/workshop/novel/${id}`]);
        }
      },
      err => {
        this.loading = false;
        console.error('Error creating novel', err);
      }
    );
  }
  private uploadCover(id: string, coverImg: File) {
    const task = this.novels.novelCoverUpload(id, coverImg);
    task.then(
      completeTask => {
        this.loading = false;
        this.router.navigate([`/workshop/novel/${id}`]);
      },
      err => console.error(err)
    );
  }

  toggleGenre(genre: Genre) {
    const val: Genre[] = this.form.genres.value;
    const i = val.indexOf(genre);
    if (i < 0) {
      val.push(genre);
    } else {
      val.splice(i, 1);
    }
    this.form.genres.updateValueAndValidity();
    this.form.genres.markAsDirty();
  }
  genreSelected(genre: Genre) {
    return this.form.genres.value.indexOf(genre) >= 0;
  }
}
