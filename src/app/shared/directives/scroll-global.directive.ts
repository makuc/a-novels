import { Directive, OnDestroy, ElementRef, HostListener, AfterViewInit, AfterViewChecked } from '@angular/core';
import { Subject } from 'rxjs';
import { ScrollService } from 'src/app/core/services/scroll.service';

@Directive({
  // tslint:disable: directive-selector
  selector: '[scrollInit]'
})
export class ScrollGlobalDirective implements OnDestroy, AfterViewChecked {
  destroyer: Subject<void> = new Subject<void>();

  // tslint:disable: variable-name no-inferrable-types
  private lastTopI: number;
  private lastBottomI: number;
  private lastTop: number = 0;

  private els: HTMLCollectionOf<Element>;
  private elsSelector: string;
  private cursorI: number;

  private emitTop: boolean = true;
  private emitBottom: boolean;
  // tslint:enable: variable-name no-inferrable-types

  constructor(
    private parent: ElementRef<HTMLDivElement>,
    private scroll: ScrollService
  ) { }

  scrollDirDown(value: number) {
    return this.lastTop < value;
  }

  ngOnDestroy() {
    this.destroyer.next();
    this.destroyer.complete();
  }

  ngAfterViewChecked() {
    const height = this.parent.nativeElement.scrollHeight;
    const offset = this.parent.nativeElement.offsetHeight;
    if (height - offset <= 0) {
      this.scroll.nextScrollable(false);
    } else {
      this.scroll.nextScrollable(true);
    }
  }

  @HostListener('scroll', ['$event'])
  onScroll(event) {
    try {

      const top = event.target.scrollTop;
      this.scroll.nextScroll({ x: 0, y: top });

      const height = this.parent.nativeElement.scrollHeight;
      const offset = this.parent.nativeElement.offsetHeight;

      // emit bottom event
      if (top > height - offset - this.scroll.offsetBottom - 1) {
        if (!this.emitBottom) {
          this.emitBottom = true;
          this.scroll.nextScrollPosition('bottom');
        }
      } else {
        this.emitBottom = false;
      }

      // emit top event
      if (top < this.scroll.offsetTop) {
        if (!this.emitTop) {
          this.emitTop = true;
          this.scroll.nextScrollPosition('top');
        }
      } else {
        this.emitTop = false;
      }

      if (this.scroll.observeElementClass) {
        if (this.scroll.observeElementClass) {
          if (!this.els || this.elsSelector !== this.scroll.observeElementClass) {
            this.els = document.getElementsByClassName(this.scroll.observeElementClass);
            this.cursorI = 0;
            this.elsSelector = this.scroll.observeElementClass;
          }
          const scrollDown = this.scrollDirDown(top);

          // tslint:disable-next-line: prefer-for-of
          let topI: number;
          let endI: number;
          for (let i = this.cursorI; i < this.els.length && i >= 0; i += scrollDown ? 1 : -1) {
            const el = this.els.item(i) as HTMLDivElement;

            if (scrollDown) {
              if (el.offsetTop + el.clientHeight <= top) {
                endI = i;
              } else if (el.offsetTop <= top) {// This element is below our scroll point
                topI = i;
              } else {
                break;
              }
            } else {
              if (el.offsetTop > top) {
                endI = i;
              } else if (el.offsetTop + el.clientHeight >= top) {// This element is below our scroll point
                topI = i;
              } else {
                break;
              }
            }

          }

          if (topI >= 0 && this.lastTopI !== topI) {
            this.cursorI = topI;

            this.lastTopI = topI;
            this.scroll.nextScrollToTop(this.els.item(topI).id);
          }
          if (endI >= 0 && this.lastBottomI !== endI) {
            this.lastBottomI = endI;
            this.scroll.nextScrollToBottom(this.els.item(endI).id);
          }
        }

        // For figuring out scroll direction
        this.lastTop = top;
      }

    } catch (err) {}
  }

}
