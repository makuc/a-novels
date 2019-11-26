import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NovelService } from 'src/app/core/services/novel.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Novel } from 'src/app/shared/models/novels/novel.model';
import { first, concatMap } from 'rxjs/operators';
import { ReviewsService } from 'src/app/core/services/reviews.service';
import { Review } from 'src/app/shared/models/novels/review.model';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent {
  fgroup: FormGroup;
  storyGroup: FormGroup;
  styleGroup: FormGroup;
  charsGroup: FormGroup;
  worldGroup: FormGroup;
  grammGroup: FormGroup;
  loading = false;
  submitted = false;
  novel: Observable<Novel>;
  review: Review;

  constructor(
    private fb: FormBuilder,
    private novels: NovelService,
    private reviews: ReviewsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.novel = this.route.paramMap
      .pipe(
        concatMap(params => this.novels.novelGet(params.get('novelID')))
      );
    this.route.paramMap
      .pipe(
        first(),
        concatMap(params => this.reviews.reviewMy(params.get('novelID'))),
        first()
      )
      .subscribe(
        review => {
          this.review = review || new Review();

          this.storyGroup = this.fb.group({
            rating: [this.review.storyRating, [Validators.required, Validators.min(1), Validators.max(5)]],
            review: [this.review.storyReview, [Validators.required]]
          });
          this.styleGroup = this.fb.group({
            rating: [this.review.styleRating, [Validators.required, Validators.min(1), Validators.max(5)]],
            review: [this.review.styleReview, [Validators.required]]
          });
          this.charsGroup = this.fb.group({
            rating: [this.review.charsRating, [Validators.required, Validators.min(1), Validators.max(5)]],
            review: [this.review.charsReview, [Validators.required]]
          });
          this.worldGroup = this.fb.group({
            rating: [this.review.worldRating, [Validators.required, Validators.min(1), Validators.max(5)]],
            review: [this.review.worldReview, [Validators.required]]
          });
          this.grammGroup = this.fb.group({
            rating: [this.review.grammRating, [Validators.required, Validators.min(1), Validators.max(5)]],
            review: [this.review.grammReview, [Validators.required]]
          });

          this.fgroup = this.fb.group({
            title: [this.review.title, [Validators.required]]
          });
        },
        console.error
      );
  }

  get fg() { return this.fgroup.controls; }
  get story() { return this.storyGroup.controls; }
  get style() { return this.styleGroup.controls; }
  get chars() { return this.charsGroup.controls; }
  get world() { return this.worldGroup.controls; }
  get gramm() { return this.grammGroup.controls; }

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

    // stop here if form is invalid
    if (this.fgroup.invalid) {
      return;
    }
    this.loading = true;

    const reviewData: Review = {
      ...this.review,

      title: this.fg.title.value,

      storyRating: this.story.rating.value,
      styleRating: this.style.rating.value,
      charsRating: this.chars.rating.value,
      worldRating: this.world.rating.value,
      grammRating: this.gramm.rating.value,

      storyReview: this.story.review.value,
      styleReview: this.style.review.value,
      charsReview: this.chars.review.value,
      worldReview: this.world.review.value,
      grammReview: this.gramm.review.value
    };

    this.reviews.reviewSet(novelID, reviewData).subscribe(
      () => this.router.navigate([`/novel/${novelID}`]),
      console.error
    );
  }
}
