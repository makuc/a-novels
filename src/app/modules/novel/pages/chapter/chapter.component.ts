import { Component, OnInit, OnDestroy, AfterViewInit, Renderer2, AfterViewChecked } from '@angular/core';
import { Location } from '@angular/common';
import { ChaptersService } from 'src/app/core/services/chapters.service';
import { Observable, fromEvent, Subject } from 'rxjs';
import { Chapter } from 'src/app/shared/models/novels/chapter.model';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil, filter, first, debounceTime, tap } from 'rxjs/operators';
import { TOC } from 'src/app/shared/models/novels/chapters-stats.model';
import { ScrollService } from 'src/app/core/services/scroll.service';
import { StickyEvent } from 'src/app/shared/directives/observe-sticky.directive';

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.scss']
})
export class ChapterComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
  end: Subject<void> = new Subject();

  activeChapter: string;
  private scrollTo: string;

  chapters$: Observable<Chapter[]>;
  done$: Observable<boolean>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private cs: ChaptersService,
    private scroll: ScrollService,
    private renderer: Renderer2
  ) {
    // NEED TO ACTUALLY FETCH THE CHAPTER, and implement it beforehand
    this.route.paramMap.pipe(
      first()
    ).subscribe(
      params => {
        this.cs.init(params.get('novelID'), params.get('chapterID'));
        this.activeChapter = params.get('chapterID');
      }
    );
    this.chapters$ = this.cs.data;
    this.done$ = this.cs.done;
    this.scroll.resetScrollable();
  }

  ngOnInit() { }
  ngAfterViewInit() {
    this.initStickyChange();
    this.initScroll();
    this.keyboardSwitch();

    this.scroll.scrollable.pipe(
      first()
    ).subscribe(
      val => {
        if (!val) {
          this.cs.more();
        }
      }
    );
  }

  ngOnDestroy() {
    this.end.next();
    this.end.complete();
  }

  ngAfterViewChecked() {
    if (this.scrollTo) {
      const elem = document.getElementById(this.scrollTo);
      elem.scrollIntoView();
      this.scrollTo = undefined;
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
      console.log('Chapter wholly read:', this.activeChapter);
      this.cs.readSet(this.activeChapter, true).subscribe();
    }
  }

  keyboardSwitch() {
    fromEvent<KeyboardEvent>(document, 'keydown').pipe(
      takeUntil(this.end),
      filter(e => e.key === 'ArrowLeft' || e.key === 'ArrowRight'),
      debounceTime(300)
    ).subscribe(e => {
      // console.log(e);
      switch (e.key) {
        case 'ArrowRight':
          this.scrollToNext();
          break;
        case 'ArrowLeft':
          console.log('Previous chapter');
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
      console.log('Scrolling back');
      elem.scrollIntoView();
    } else {
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
    if (elem) {
      console.log('Scrolling...');
      elem.scrollIntoView();
    } else {
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
      this.renderer[!e.detail.stuck ? 'addClass' : 'removeClass'](e.detail.target.firstChild, 'mat-elevation-z9');
      this.renderer[!e.detail.stuck ? 'addClass' : 'removeClass'](e.detail.target.firstChild, 'stuck');
    });
  }

}
