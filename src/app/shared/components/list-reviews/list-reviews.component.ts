import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReviewsService } from 'src/app/core/services/reviews.service';
import { Observable, Subject } from 'rxjs';
import { Review } from 'src/app/shared/models/novels/review.model';
import { switchMap, map, take, takeUntil } from 'rxjs/operators';
import { ScrollService } from 'src/app/core/services/scroll.service';

@Component({
  selector: 'app-list-reviews',
  templateUrl: './list-reviews.component.html',
  styleUrls: ['./list-reviews.component.scss']
})
export class ListReviewsComponent implements OnInit, OnDestroy {
  private end: Subject<void> = new Subject();

  @Input() novelID: string;
  sortField = 'createdAt';
  reviews$: Observable<Review[]>;

  constructor(
    private rs: ReviewsService,
    private scroll: ScrollService
  ) { }

  ngOnInit() {
    this.rs.init(this.novelID, this.sortField);
    this.reviews$ = this.rs.data;

    this.scroll.reset();
    this.scroll.scrollPosition.pipe(
      takeUntil(this.end)
    ).subscribe(e => this.handleScroll(e));
  }

  ngOnDestroy() {
    this.end.next();
    this.end.complete();
  }

  handleScroll(e: 'top' | 'bottom') {
    if (e === 'bottom') {
      this.rs.more();
    }
  }

}
