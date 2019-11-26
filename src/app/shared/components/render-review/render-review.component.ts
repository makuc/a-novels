import { Component, OnInit, Input } from '@angular/core';
import { Review } from '../../models/novels/review.model';
import { Observable } from 'rxjs';
import { ReviewsService } from 'src/app/core/services/reviews.service';
import { Like, LikeStats } from '../../models/like.model';

@Component({
  selector: 'app-render-review',
  templateUrl: './render-review.component.html',
  styleUrls: ['./render-review.component.scss']
})
export class RenderReviewComponent implements OnInit {

  @Input() review: Review;
  @Input() novelID: string;
  // tslint:disable: no-inferrable-types

  rate: number = -1;
  state$: Observable<Like>;
  stats$: Observable<LikeStats>;

  constructor(
    private rs: ReviewsService
  ) { }

  ngOnInit() {
    this.state$ = this.rs.likeState(this.review.id);
    this.stats$ = this.rs.getLikes(this.review.id);
  }

  shortNum(value: number): string {
    if (!value) {
      // Undefined values
      return '0';
    } else if (value >= 1000000) {
      // Values in M
      value = Math.floor(value / 100000) / 10;
      return `${value.toFixed(1)} M`;

    } else if (value >= 1000) {
      // Values in K
      value = Math.floor(value / 100) / 10;
      return `${value.toFixed(1)} k`;
    } else {
      // Values in 0
      return `${value.toFixed(0)}`;
    }
  }
  shortSumNum(positive: number, negative: number) {
    return this.shortNum(positive - negative);
  }

  toggleLike(cur: Like) {
    if (cur && cur.value) {
      this.rs.unlike(this.review.id).subscribe();
    } else {
      this.rs.like(this.review.id).subscribe();
    }
  }
  toggleDislike(cur: Like) {
    if (cur && cur.value === false) {
      this.rs.unlike(this.review.id).subscribe();
    } else {
      this.rs.dislike(this.review.id).subscribe();
    }
  }

}
