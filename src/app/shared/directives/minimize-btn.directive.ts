import { Directive, Renderer2, ElementRef, AfterViewInit, Input } from '@angular/core';

@Directive({
  selector: '[appMinimizeBtn]'
})
export class MinimizeBtnDirective implements AfterViewInit {

  @Input() color = 'stacked';
  @Input() minimizedMaxHeight = '15rem';

  private min = false;
  private btn: HTMLButtonElement;

  constructor(
    private rend: Renderer2,
    private el: ElementRef
  ) { }

  ngAfterViewInit() {
    this.rend.addClass(this.el.nativeElement, 'minimize');

    this.btn = this.rend.createElement('button');
    this.rend.setProperty(this.btn, 'type', 'button');
    this.rend.addClass(this.btn, 'minimize-btn');
    this.rend.appendChild(this.el.nativeElement, this.btn);
    this.rend.listen(this.btn, 'click', () => {
      this.toggleMin();
    });

    this.toggleMin();
  }

  toggleMin() {
    this.min = !this.min;
    if (this.min) {
      this.rend.setStyle(this.el.nativeElement, 'max-height', this.minimizedMaxHeight);

      this.rend.setProperty(this.btn, 'innerHTML', 'Show more');
      this.rend.addClass(this.btn, `bckg-g-${this.color}-0deg`);
      this.rend.removeClass(this.btn, `bckg-${this.color}`);
      this.rend.addClass(this.btn, 'min');
    } else {
      this.rend.setStyle(this.el.nativeElement, 'max-height', 'initial');

      this.rend.setProperty(this.btn, 'innerHTML', 'Show less');
      this.rend.removeClass(this.btn, `bckg-g-${this.color}-0deg`);
      this.rend.addClass(this.btn, `bckg-${this.color}`);
      this.rend.removeClass(this.btn, 'min');
    }
  }

}
