import { Component, OnInit, OnDestroy, AfterViewInit, Renderer2, AfterViewChecked } from '@angular/core';
import { Location } from '@angular/common';
import { ChaptersService } from 'src/app/core/services/chapters.service';
import { Observable, fromEvent, Subject } from 'rxjs';
import { Chapter } from 'src/app/shared/models/novels/chapter.model';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil, filter, first, debounceTime, tap, switchMap } from 'rxjs/operators';
import { TOC } from 'src/app/shared/models/novels/chapters-stats.model';
import { ScrollService } from 'src/app/core/services/scroll.service';
import { StickyEvent } from 'src/app/shared/directives/observe-sticky.directive';
import { firestore } from 'firebase';
import { NovelService } from 'src/app/core/services/novel.service';
import { Like, LikeStats } from 'src/app/shared/models/like.model';
import { UnauthorizedHelper } from 'src/app/core/helpers/unauthorized.helper';
import { keysConfig } from 'src/app/keys.config';

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.scss']
})
export class ChapterComponent extends UnauthorizedHelper implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
  end: Subject<void> = new Subject();

  novelID: string;
  activeChapter: string;
  private scrollTo: string;

  chapters$: Observable<Chapter[]>;
  done$: Observable<boolean>;
  likeState$: Observable<Like>;
  likes$: Observable<LikeStats>;
  busyFav = false;
  islib$: Observable<boolean>;
  busyLib = false;

  toc$: Observable<TOC>;

  tocOpen = false;

  constructor(
    private route: ActivatedRoute,
    router: Router,
    private location: Location,
    private ns: NovelService,
    private cs: ChaptersService,
    private scroll: ScrollService,
    private renderer: Renderer2
  ) {
    super(router);

    this.novelID = this.route.snapshot.paramMap.get('novelID');
    this.route.paramMap.pipe(
      takeUntil(this.end)
    ).subscribe(
      params => {
        this.cs.init(this.novelID, params.get('chapterID'));
        this.activeChapter = params.get('chapterID');
      }
    );
    this.chapters$ = this.cs.data;
    this.done$ = this.cs.done;
    this.scroll.resetScrollable();

    this.likeState$ = this.ns.likeState();
    this.likes$ = this.ns.getLikes();
    this.islib$ = this.ns.inLibrary(this.novelID);

  }

  ngOnInit() { }
  ngAfterViewInit() {
    this.initStickyChange();
    this.initScroll();
    this.keyboardSwitch();

    this.cs.loading.pipe(
      filter(val => val === false),
      switchMap(() => this.scroll.scrollable),
      debounceTime(400),
      takeUntil(this.end)
    ).subscribe(
      val => {
        if (!val) {
          this.cs.more();
        }
      }
    );

    this.toc$ = this.cs.readToc$;
  }

  ngOnDestroy() {
    this.end.next();
    this.end.complete();
  }

  ngAfterViewChecked() {
    if (this.scrollTo) {
      const elem = document.getElementById(this.scrollTo);
      if (elem) {
        elem.scrollIntoView();
        this.activeChapter = this.scrollTo;
        this.scrollTo = undefined;
      }
    }
  }

  showChapterIndex(cid: string) {
    return this.cs.chapterID_to_index(this.cs.readToc.toc, cid) + 1;
  }

  initScroll() {
    this.scroll.offset(100, 400);
    this.scroll.observeElementClass = 'scrollTo';

    this.scroll.scrollPosition.pipe(
      takeUntil(this.end)
    ).subscribe(e => this.handleScroll(e));

    this.scroll.scrollToTop.pipe(
      takeUntil(this.end)
    ).subscribe(id => this.scrollTopHandler(id));

    this.scroll.scrollToBottom.pipe(
      takeUntil(this.end)
    ).subscribe(id => this.scrollBottomHandler(id));
  }

  handleScroll(e: 'top' | 'bottom') {
    switch (e) {
      case 'top':
        this.cs.prev();
        break;
      case 'bottom':
        this.cs.more();
        break;
    }
  }
  scrollTopHandler(id: string) {
    if (id && id !== 'no-ch') {
      // const index = this.cs.nextChapterID(id);
      this.cs.readSet(id).subscribe();
      this.activeChapter = id;
      const url = this.router.createUrlTree([`../${id}`], { relativeTo: this.route });
      // console.log('new url:', url.toString());
      this.location.go(url.toString());
    }
  }
  scrollBottomHandler(id: string) {
    if (id === 'no-ch' && this.activeChapter) {
      this.cs.readSet(this.activeChapter, true).subscribe();
    }
  }

  keyboardSwitch() {
    fromEvent<KeyboardEvent>(document, 'keydown').pipe(
      filter(e => e.key === 'ArrowLeft' || e.key === 'ArrowRight'),
      debounceTime(300),
      takeUntil(this.end)
    ).subscribe(e => {
      // console.log(e);
      switch (e.key) {
        case 'ArrowRight':
          this.scrollToNext();
          break;
        case 'ArrowLeft':
          this.scrollToPrev();
          break;
      }
    });
  }
  scrollToPrev() {
    const prev = this.cs.prevChapterID(this.activeChapter);
    this.scrollToPrevID(prev);
  }
  scrollToPrevID(id: string) {
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView();
      this.activeChapter = id;
    } else if (id) {
      this.cs.prev();
      this.cs.loading.pipe(
        filter(val => val === false),
        first()
      ).subscribe(() => this.scrollTo = id);
    }
  }
  scrollToNext() {
    const next = this.cs.nextChapterID(this.activeChapter);
    this.scrollToNextID(next);
  }
  scrollToNextID(id: string) {
    const elem = document.getElementById(id);
    if (elem && elem != null) {
      elem.scrollIntoView();
      this.activeChapter = id;
    } else if (id) {
      this.cs.more();
      this.cs.loading.pipe(
        filter(val => val === false),
        first()
      ).subscribe(() => this.scrollTo = id);
    }
  }

  initStickyChange() {
    fromEvent<StickyEvent>(document, 'sticky-change').pipe(
      takeUntil(this.end)
    ).subscribe(e => {
      this.renderer[!e.detail.stuck ? 'addClass' : 'removeClass'](e.detail.target.firstChild, 'mat-elevation-z2');
      this.renderer[!e.detail.stuck ? 'addClass' : 'removeClass'](e.detail.target, 'stuck');
    });
  }

  toDate(timestamp: firestore.Timestamp) {
    return timestamp.toDate();
  }

  toggleToc() {
    this.tocOpen = !this.tocOpen;
  }

  like(like: Like) {
    this.busyFav = true;
    if (!like || !like.value) {
      this.ns.like().subscribe(
        () => this.busyFav = false,
        err => this.handleUnauthorized(err)
      );
    } else {
      this.ns.unlike().subscribe(
        () => this.busyFav = false,
        err => this.handleUnauthorized(err)
      );
    }
  }

  toggleLibrary(inLib: boolean) {
    this.busyLib = true;
    if (inLib) {
      this.ns.libRemove(this.novelID).then(
        () => this.busyLib = false,
        err => this.handleUnauthorized(err)
      );
    } else {
      this.ns.libAdd(this.novelID).then(
        () => this.busyLib = false,
        err => this.handleUnauthorized(err)
      );
    }
  }

  get returnQueryParams() {
    return {
      [keysConfig.RETURN_URL_KEY]: this.router.url
    };
  }

}
