import { Component, ViewChild, ElementRef, ViewContainerRef, Renderer2, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})
export class TextEditorComponent implements AfterViewInit {
  @ViewChild('txe', { static: true }) txe: ElementRef;

  @Input() required: boolean;
  @Input() placeholder: string;
  @Input() value: string;
  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() onfocus: EventEmitter<void> = new EventEmitter<void>();
  @Output() onblur: EventEmitter<void> = new EventEmitter<void>();

  error: string;

  constructor(
    public viewContainerRef: ViewContainerRef,
    private rend2: Renderer2
  ) { }

  ngAfterViewInit() {
    this.txe.nativeElement.innerHTML = this.value;
  }

  keyPress(event: any) {/*
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }*/
  }

  public process(event: any = null) {
    let child = this.txe.nativeElement.firstChild;

    while (child) {
      const sel = window.getSelection();
      const curNode = sel.anchorNode;
      const curOffset = sel.anchorOffset;

      if (child.nodeType === 3) {
        this.moveElementToChild(child, 'p');
        sel.setPosition(curNode, curOffset);
      } else if (child.nodeType === 1) {

        switch (child.nodeName.toUpperCase) {
          case 'B':
            this.moveElementToChild(child, 'p');
            sel.setPosition(curNode, curOffset);
            break;
        }

      }
      // Now continue to the next child
      child = this.rend2.nextSibling(child);
    }

    this.value = this.txe.nativeElement.innerHTML;
    if (this.value) {
      this.error = '';
    }
    this.valueChange.emit(this.value);
  }

  public doFocus(event: any) {
    this.onfocus.emit();
  }

  public doBlur(event: any) {
    this.process();
    if (!this.value) {
      this.error = ''
      this.rend2.addClass(this.txe.nativeElement, 'mat-error');
    }

    this.onblur.emit();
  }

  private moveElementToChild(child: any, newTag: string) {
    const newEle = this.rend2.createElement(newTag);
    this.rend2.insertBefore(this.rend2.parentNode(child), newEle, child);
    this.rend2.appendChild(newEle, child);
  }

  public toggleBold(event: any) {
    event.preventDefault();
    document.execCommand('bold');
    this.txe.nativeElement.focus();
  }

  public toggleItalic(event: any) {
    event.preventDefault();
    document.execCommand('italic');
    this.txe.nativeElement.focus();
  }

}
