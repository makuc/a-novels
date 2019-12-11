import { storageKeys } from 'src/app/keys.config';
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { NovelService, NovelsQueryConfig } from 'src/app/core/services/novel.service';
import { UserService } from 'src/app/core/services/user.service';
import { Observable, Subject } from 'rxjs';
import { Novel } from 'src/app/shared/models/novels/novel.model';
import { switchMap, first, tap, takeUntil, filter } from 'rxjs/operators';
import { UserProfile } from 'src/app/shared/models/users/user-profile.model';
import { ScrollService } from 'src/app/core/services/scroll.service';
import { AuthenticationService } from 'src/app/core/authentication/authentication.service';

@Component({
  selector: 'app-works',
  templateUrl: './works.component.html',
  styleUrls: ['./works.component.scss']
})
export class WorksComponent implements OnInit, OnDestroy, AfterViewInit {
  private end: Subject<void> = new Subject();

  novels$: Observable<Novel[]>;
  init = false;
  queryChange: Subject<Partial<NovelsQueryConfig>> = new Subject();
  queryConfig: Partial<NovelsQueryConfig> = {
    sortField: 'iTitle',
    genres: [],
    public: false
  };

  constructor(
    private auth: AuthenticationService,
    private ns: NovelService,
    private scroll: ScrollService
  ) { }

  ngOnInit() {
    this.queryConfig.authorID = this.auth.currentSnapshot.uid;
    this.updateQuery();
    this.ns.init(this.queryConfig);
    this.initSort();
    this.novels$ = this.ns.data;
  }

  ngOnDestroy() {
    this.end.next();
    this.end.complete();
  }

  ngAfterViewInit() {
    this.initScroll();
  }

  initSort(): void {
    this.queryChange.pipe(
      tap(q => this.ns.init(q)),
      takeUntil(this.end)
    ).subscribe();
  }

  testiram(data: any) {
    console.log(data);
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

  private updateQuery(): void {
    this.queryChange.next(this.queryConfig);
  }

}
