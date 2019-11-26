import {
  Directive,
  ElementRef,
  Renderer2,
  AfterViewInit
} from '@angular/core';

export interface StickyEvent {
  detail: {
    stuck: boolean,
    target: HTMLElement
  };
}

@Directive({
  // tslint:disable: directive-selector no-shadowed-variable
  selector: '[observeStickyFooter]'
})
export class ObserveStickyFooterDirective implements AfterViewInit {

  constructor(
    private rend: Renderer2,
    private el: ElementRef<HTMLElement>
  ) { }

  ngAfterViewInit() {
    const container = document.getElementById('scroll-container');
    this.observeStickyHeaderChanges(container);
  }

  /**
   * Notifies when elements w/ the `sticky` class begin to stick or stop sticking.
   * Note: the elements should be children of `container`.
   */
  observeStickyHeaderChanges(container: HTMLElement) {
    // this.observeHeaders(container);
    this.observeFooters(container);
  }

  /**
   * Sets up an intersection observer to notify when elements with the class
   * `.sticky_sentinel--bottom` become visible/invisible at the bottom of the
   * container.
   */
  observeFooters(container: HTMLElement) {
    const observer = new IntersectionObserver((records, observer) => {
      for (const record of records) {
        const targetInfo = record.boundingClientRect;
        const stickyTarget = record.target.parentElement.querySelector<HTMLElement>('.sticky');
        const rootBoundsInfo = record.rootBounds;
        const ratio = record.intersectionRatio;

        // Started sticking.
        if (targetInfo.bottom > rootBoundsInfo.top && ratio === 1) {
          this.fireEvent(true, stickyTarget);
        } else {
          this.fireEvent(false, stickyTarget);
        }

      }
    }, {threshold: [1], root: container});

    // Add the bottom sentinels to each section and attach an observer.
    const sentinels = this.addSentinels(container, 'sticky_sentinel--bottom');
    sentinels.forEach(el => observer.observe(el));
  }

  addSentinels(container: HTMLElement, className: string) {
    const stickies = container.querySelectorAll<HTMLDivElement>('.sticky');
    return Array.from(stickies).map((el: HTMLDivElement) => {
      const sentinel = document.createElement('div');
      sentinel.classList.add('sticky_sentinel', className);
      return el.parentElement.appendChild(sentinel);
    });
  }

  /**
   * Dispatches the `sticky-event` custom event on the target element.
   */
  fireEvent(stuck: boolean, target: HTMLElement) {
    const e = new CustomEvent('sticky-change', {detail: {stuck, target}});
    document.dispatchEvent(e);
  }

}
