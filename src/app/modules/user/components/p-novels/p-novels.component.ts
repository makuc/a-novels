import { storageKeys } from 'src/app/keys.config';
import { Component, OnInit, OnDestroy, Input, AfterViewInit } from '@angular/core';
import { NovelService, NovelsQueryConfig } from 'src/app/core/services/novel.service';
import { Observable, Subject } from 'rxjs';
import { Novel } from 'src/app/shared/models/novels/novel.model';
import { switchMap, first, takeUntil, filter } from 'rxjs/operators';
import { ScrollService } from 'src/app/core/services/scroll.service';

@Component({
  selector: 'app-p-novels',
  templateUrl: './p-novels.component.html',
  styleUrls: ['./p-novels.component.scss']
})
export class PNovelsComponent implements OnInit, AfterViewInit, OnDestroy {
  private end: Subject<void> = new Subject();

  @Input() uid: string;

  init = false;
  novels$: Observable<Novel[]>;
  queryConfig: Partial<NovelsQueryConfig> = {
    sortField: 'iTitle'
  };

  constructor(
    private ns: NovelService,
    private scroll: ScrollService
  ) { }

  ngOnInit() {
    this.queryConfig.authorID = this.uid;
    this.ns.init(this.queryConfig);
    this.novels$ = this.ns.data;
    this.init = true;
  }

  ngAfterViewInit() {
    this.initScroll();
    this.ns.loading.pipe(
      filter(val => val === false),
      switchMap(() => this.scroll.scrollable),
      first()
    ).subscribe(
      val => {
        if (!val) {
          this.ns.more();
        }
      }
    );
  }

  ngOnDestroy() {
    this.end.next();
    this.end.complete();
  }

  coverURL(custom: boolean, novelID: string): string {
    return storageKeys.GEN_URL(
      storageKeys.BASIC_URL,
      storageKeys.NOVELS_COVER_PATH,
      custom ? novelID : storageKeys.NOVELS_COVER_DEFAULT_NAME,
      storageKeys.NOVELS_COVER_THUMBNAIL
    );
  }

  initScroll() {
    this.scroll.offset(0, 400);
    this.scroll.scrollPosition.pipe(
      takeUntil(this.end)
    ).subscribe(e => this.handleScroll(e));
  }

  handleScroll(pos: 'top' | 'bottom') {
    if (!this.init) { return; }

    if (pos === 'bottom') {
      this.ns.more();
    }
  }

}
