import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NovelService } from 'src/app/core/services/novel.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Novel } from 'src/app/shared/models/novels/novel.model';
import { switchMap } from 'rxjs/operators';
import { ChaptersService } from 'src/app/core/services/chapters.service';

@Component({
  selector: 'app-chapter-add',
  templateUrl: './chapter-add.component.html',
  styleUrls: ['./chapter-add.component.scss']
})
export class ChapterAddComponent implements OnInit {
  fgroup: FormGroup;
  loading = false;
  submitted = false;
  novel: Observable<Novel>;

  constructor(
    private fb: FormBuilder,
    private novels: NovelService,
    private chapters: ChaptersService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.novel = this.route.paramMap
      .pipe(
        switchMap(params => this.novels.novelGet(params.get('novelID')))
      );
  }

  ngOnInit() {
    this.fgroup = this.fb.group({
      title: ['', [Validators.required]],
      chapter: ['', [Validators.required]],
      public: [false]
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

  onSubmit(novelID: string) {
    this.submitted = true;

    this.validateAllFormFields(this.fgroup);

    // return;

    // stop here if form is invalid
    if (this.fgroup.invalid) {
      return;
    }
    this.loading = true;

    this.chapters.chapterAdd(novelID, {
      title: this.form.title.value,
      content: this.form.chapter.value,
      public: this.form.public.value
    }).subscribe(
      chapterID => this.router.navigate([`/workshop/novel/${novelID}`]),
      (err) => console.error('Add chapter:', err)
    );
  }
}
