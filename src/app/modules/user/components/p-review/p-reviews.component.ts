import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Review } from 'src/app/shared/models/novels/review.model';
import { UserReviewsService } from '../../services/user-reviews.service';
import { ScrollService } from 'src/app/core/services/scroll.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-p-reviews',
  templateUrl: './p-reviews.component.html',
  styleUrls: ['./p-reviews.component.scss'],
  providers: [
    UserReviewsService
  ]
})
export class PReviewsComponent implements OnInit, OnDestroy {
  private end: Subject<void> = new Subject();

  @Input() uid: string;

  reviews$: Observable<Review[]>;

  constructor(
    private urs: UserReviewsService,
    private scroll: ScrollService
  ) { }

  ngOnInit() {
    this.urs.init(this.uid, { reverse: true, sortField: 'updatedAt' });
    this.reviews$ = this.urs.data;
    this.initScroll();
  }

  ngOnDestroy() {
    this.end.next();
    this.end.complete();
  }

  initScroll() {
    this.scroll.offset(50, 100);
    this.scroll.scrollPosition.pipe(
      takeUntil(this.end)
    ).subscribe(e => this.scrollHandler(e));
  }

  scrollHandler(pos: 'bottom' | 'top') {
    if (pos === 'bottom') {
      this.urs.more();
    }
  }

}
