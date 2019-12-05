import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NovelService } from 'src/app/core/services/novel.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { Novel } from 'src/app/shared/models/novels/novel.model';
import { switchMap, first, filter } from 'rxjs/operators';
import { ChaptersService } from 'src/app/core/services/chapters.service';
import { Chapter } from 'src/app/shared/models/novels/chapter.model';

@Component({
  selector: 'app-chapter-add',
  templateUrl: './chapter-add.component.html',
  styleUrls: ['./chapter-add.component.scss']
})
export class ChapterAddComponent implements OnInit {

  novelID: string;
  chapterID: string;
  fgroup: FormGroup;
  loading = false;
  submitted = false;
  novel: Observable<Novel>;
  chapter: Chapter;

  constructor(
    private fb: FormBuilder,
    private novels: NovelService,
    private cs: ChaptersService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.novelID = this.route.snapshot.paramMap.get('novelID');
    this.chapterID = this.route.snapshot.paramMap.get('chapterID');

    this.novel = this.novels.novelGet(this.novelID);
    this.cs.init(this.novelID, this.chapterID);

    this.cs.loading.pipe(
      filter(val => val === false),
      switchMap(() => this.cs.data),
      first()
    ).subscribe(
      chapters => this.prepareFormGroup(chapters),
      (err) => console.error('Getting ch:', err)
    );
  }

  get form() {
    return this.fgroup.controls;
  }

  prepareFormGroup(chapters: Chapter[]) {
    if (chapters.length > 0) {
      this.chapter = chapters[0];
    } else {
      this.chapter = new Chapter();
    }

    this.fgroup = this.fb.group({
      title: [this.chapter.title, [Validators.required]],
      chapter: [this.chapter.content, [Validators.required]],
      public: [this.chapter.public]
    });
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

    const newCh: Chapter = {
      ...this.chapter,
      title: this.form.title.value,
      content: this.form.chapter.value,
      public: this.form.public.value
    };
    this.cs.chapterAdd(newCh).subscribe(
      () => this.router.navigate([`/workshop/novel/${this.novelID}`]),
      (err) => console.error('Adding chapter:', err)
    );
  }
}
