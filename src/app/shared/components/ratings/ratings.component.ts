import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Novel } from 'src/app/shared/models/novels/novel.model';
import { ReviewsService } from 'src/app/core/services/reviews.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.scss']
})
export class RatingsComponent implements OnInit, OnDestroy {
  private destroyer: Subject<void> = new Subject<void>();

  // tslint:disable: no-inferrable-types
  story: number = 0;
  style: number = 0;
  chars: number = 0;
  world: number = 0;
  gramm: number = 0;
  nFavs: number = 0;
  nRevs: number = 0;

  @Input() novelID: string;

  constructor(
    private rs: ReviewsService
  ) { }

  ngOnInit() {
    this.rs.statsGet(this.novelID).pipe(
      takeUntil(this.destroyer)
    ).subscribe(
      stats => {
        if (stats) {
          this.nRevs = stats.nRevs as number || 0;
          this.nFavs = stats.nFavs as number || 0;
          this.story = (stats.sumStory as number) / this.nRevs || 0;
          this.style = (stats.sumStyle as number) / this.nRevs || 0;
          this.chars = (stats.sumChars as number) / this.nRevs || 0;
          this.world = (stats.sumWorld as number) / this.nRevs || 0;
          this.gramm = (stats.sumGramm as number) / this.nRevs || 0;
        }
      },
      (err) => console.error(err)
    );
  }

  ngOnDestroy() {
    this.destroyer.next();
    this.destroyer.complete();
  }

}
