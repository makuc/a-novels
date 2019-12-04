import { Directive, ElementRef, Renderer2, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[appBtn]'
})
export class BtnDirective implements OnInit {

  @Input() color = 'normal';
  @Input() label: string;

  constructor(
    private el: ElementRef<HTMLElement>,
    private rend: Renderer2
  ) {
    this.rend.addClass(this.el.nativeElement, `btn`);
  }

  ngOnInit() {

    this.rend.addClass(this.el.nativeElement, `bckg-${this.color}`)
    this.rend.addClass(this.el.nativeElement, `color-${this.color}`);
    // aria-label="Edit tags" matTooltip="Edit tags"
    if (this.label) {
      this.rend.setAttribute(this.el.nativeElement, 'aria-label', this.label);
      this.rend.setAttribute(this.el.nativeElement, 'title', this.label);
    }
  }

}
