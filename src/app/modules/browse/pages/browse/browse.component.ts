import { storageKeys } from 'src/app/keys.config';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NovelService } from 'src/app/core/services/novel.service';
import { Observable, Subject } from 'rxjs';
import { Novel } from 'src/app/shared/models/novels/novel.model';
import { takeUntil, switchMap, tap } from 'rxjs/operators';
import { ScrollService } from 'src/app/core/services/scroll.service';
import { QueryConfig } from 'src/app/core/services/paginate-collection.service';

@Component({
  selector: 'app-browse',
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss']
})
export class BrowseComponent implements OnInit, OnDestroy {
  end: Subject<void> = new Subject<void>();

  queryChange: Subject<Partial<QueryConfig>> = new Subject();
  novelsList: Observable<Novel[]>;
  queryConfig: Partial<QueryConfig> = {
    sortField: 'iTitle',
    genres: []
  };

  constructor(
    private ns: NovelService,
    private scroll: ScrollService
  ) {
    this.ns.init(this.queryConfig);
    this.novelsList = this.ns.data;
  }

  ngOnInit() {
    this.initScroll();
    this.initSort();
  }
  ngOnDestroy() {
    this.end.next();
    this.end.complete();
  }

  initSort() {
    this.queryChange.pipe(
      tap(q => this.ns.init(q)),
      takeUntil(this.end)
    ).subscribe();
  }

  initScroll() {
    this.scroll.offset(50, 100);
    this.scroll.scrollPosition.pipe(
      takeUntil(this.end)
    ).subscribe(e => this.scrollHandler(e));
  }

  scrollHandler(pos: 'bottom' | 'top') {
    if (pos === 'bottom') {
      this.ns.more();
    }
  }

  coverURL(custom: boolean, novelID: string): string {
    return storageKeys.GEN_URL(
      storageKeys.BASIC_URL,
      storageKeys.NOVELS_COVER_PATH,
      custom ? novelID : storageKeys.NOVELS_COVER_DEFAULT_NAME,
      storageKeys.NOVELS_COVER_THUMBNAIL
    );
  }

  updateQuery() {
    this.queryChange.next(this.queryConfig);
  }

  toggleSortDirection() {
    this.queryConfig.reverse = !this.queryConfig.reverse;
    this.updateQuery();
  }
}
