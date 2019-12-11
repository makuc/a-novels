import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { NovelService, NovelsQueryConfig } from 'src/app/core/services/novel.service';
import { Observable, Subject } from 'rxjs';
import { Novel } from 'src/app/shared/models/novels/novel.model';
import { takeUntil, tap } from 'rxjs/operators';
import { ScrollService } from 'src/app/core/services/scroll.service';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
  providers: [
    NovelService
  ]
})
export class BrowseComponent implements OnInit, AfterViewInit, OnDestroy {
  end: Subject<void> = new Subject<void>();

  novels$: Observable<Novel[]>;
  queryChange: Subject<Partial<NovelsQueryConfig>> = new Subject();
  queryConfig: Partial<NovelsQueryConfig> = {
    sortField: 'iTitle',
    genres: []
  };

  constructor(
    private ns: NovelService,
    private scroll: ScrollService
  ) { }

  ngOnInit(): void {
    this.initSort();
    this.updateQuery();
    this.novels$ = this.ns.data;
  }
  ngAfterViewInit() {
    this.initScroll();
  }
  ngOnDestroy(): void {
    this.end.next();
    this.end.complete();
  }

  initSort(): void {
    this.queryChange.pipe(
      takeUntil(this.end)
    ).subscribe(q => this.ns.init(q));
  }

  initScroll(): void {
    this.scroll.offset(50, 150);
    this.scroll.scrollPosition.pipe(
      takeUntil(this.end)
    ).subscribe(e => this.scrollHandler(e));
  }

  scrollHandler(pos: 'bottom' | 'top'): void {
    if (pos === 'bottom') {
      this.ns.more();
    }
  }

  updateQuery(): void {
    this.queryChange.next(this.queryConfig);
  }

  toggleSortDirection(): void {
    this.queryConfig.reverse = !this.queryConfig.reverse;
    this.updateQuery();
  }
}
