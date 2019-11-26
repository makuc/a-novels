import { storageKeys } from 'src/app/keys.config';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NovelService, NovelsQueryConfig } from 'src/app/core/services/novel.service';
import { UserService } from 'src/app/core/services/user.service';
import { Observable, Subject } from 'rxjs';
import { Novel } from 'src/app/shared/models/novels/novel.model';
import { switchMap, first, tap, takeUntil } from 'rxjs/operators';
import { UserProfile } from 'src/app/shared/models/users/user-profile.model';
import { ScrollService } from 'src/app/core/services/scroll.service';

@Component({
  selector: 'app-works',
  templateUrl: './works.component.html',
  styleUrls: ['./works.component.scss']
})
export class WorksComponent implements OnInit, OnDestroy {
  private end: Subject<void> = new Subject();

  s: any;
  novelsList: Observable<Novel[]>;
  queryConfig: Partial<NovelsQueryConfig> = {
    sortField: 'iTitle',
    public: false
  };

  constructor(
    private ns: NovelService,
    private us: UserService,
    private scroll: ScrollService
  ) {
    this.s = storageKeys;
    this.us.currentUser.pipe(
      first()
    ).subscribe(
      (user) => {
        this.queryConfig.authorID = user.uid;
        this.ns.init(this.queryConfig);
        this.novelsList = this.ns.data;
      }
    );
  }

  ngOnInit() {
    this.initScroll();
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
    if (pos === 'bottom') {
      this.ns.more();
    }
  }

}
