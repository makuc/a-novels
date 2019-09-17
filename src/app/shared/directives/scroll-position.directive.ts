import { Directive, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';


@Directive({
  // tslint:disable: directive-selector
  selector: '[scroll-pos]'
})
export class ScrollPositionDirective {

  @Output() scrollPosition = new EventEmitter();

  constructor(public el: ElementRef) { }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    try {

      const top = event.target.pageYOffset;
      // let number = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
      console.log('Top: ', top);
      console.log('PageYOffset: ', window.scrollY);
      const height = this.el.nativeElement.scrollHeight;
      console.log('Height: ', height);
      const offset = this.el.nativeElement.offsetHeight;
      console.log('Offset: ', offset);

      // emit bottom event
      if (top > height - offset - 1) {
        this.scrollPosition.emit('bottom');
      }

      // emit top event
      if (top === 0) {
        this.scrollPosition.emit('top');
      }

    } catch (err) {}
  }

}
