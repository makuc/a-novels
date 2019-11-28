import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ScrollPos {
  x: number;
  y: number;
}
@Injectable({
  providedIn: 'root'
})
export class ScrollService {

  // tslint:disable: variable-name
  _scrollable: BehaviorSubject<boolean> = new BehaviorSubject(false);
  _scroll: BehaviorSubject<ScrollPos> = new BehaviorSubject({ x: 0, y: 0 });
  _scrollPosition: BehaviorSubject<'top' | 'bottom'> = new BehaviorSubject(null);
  _scrollToTop: BehaviorSubject<string> = new BehaviorSubject(null);
  _scrollToBottom: BehaviorSubject<string> = new BehaviorSubject(null);
  offsetTop = 0;
  offsetBottom = 0;
  observeElementClass: string;

  constructor() { }

  scrollable = this._scrollable.asObservable();
  scroll = this._scroll.asObservable();
  scrollPosition = this._scrollPosition.asObservable();
  scrollToTop = this._scrollToTop.asObservable();
  scrollToBottom = this._scrollToBottom.asObservable();

  nextScrollable(value: boolean) {
    if (this._scrollable.value !== value) {
      this._scrollable.next(value);
    }
  }
  resetScrollable() {
    this._scrollable.next(false);
  }
  nextScrollPosition(value: 'top' | 'bottom') {
    this._scrollPosition.next(value);
  }
  nextScroll(value: ScrollPos) {
    this._scroll.next(value);
  }
  nextScrollToTop(value: string) {
    this._scrollToTop.next(value);
  }
  nextScrollToBottom(value: string) {
    this._scrollToBottom.next(value);
  }

  offset(top: number, bottom: number) {
    this.reset();
    this.offsetTop = top;
    this.offsetBottom = bottom;
  }
  reset() {
    this.offsetTop = 0;
    this.offsetBottom = 0;
    this.observeElementClass = undefined;
  }

}
