import {
  Component,
  ViewChild,
  ElementRef,
  Renderer2,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  OnDestroy,
  DoCheck,
  HostBinding,
  ViewEncapsulation
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { DomSanitizer } from '@angular/platform-browser';
import * as xss from 'xss';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: TextEditorComponent
    }
  ]
})
export class TextEditorComponent
       implements AfterViewInit,
                  ControlValueAccessor,
                  MatFormFieldControl<string>,
                  OnDestroy,
                  DoCheck {

  static nextId = 0;

  // tslint:disable: variable-name
  private _placeholder: string;
  private _required: boolean;
  private _tabindex = '0';
  private _disabled: boolean;
  private _id: string;
  _value: string;
  // tslint:enable: variable-name

  focused = false;
  stateChanges = new Subject<void>();
  controlType = 'txe';
  errorState = false;

  @HostBinding('attr.id') hostId = `txe-${TextEditorComponent.nextId++}`;
  @HostBinding('attr.tabindex') hostTabindex = null;
  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return !this.touched && (this.focused || !this.empty);
  }
  @HostBinding('attr.aria-describedby') describedBy = '';

  @ViewChild('txe', { static: true }) txe: ElementRef;

  @Input()
  set id(value: string) {
    this._id = value;
  }
  get id() {
    return this._id;
  }

  @Input()
  set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
  }
  get required() {
    return this._required;
  }

  @Input()
  set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  get placeholder() {
    return this._placeholder;
  }

  @Input()
  set value(value: string) {
    this._value = value;
    this.renderer.setProperty(this.txe.nativeElement, 'innerHTML', this._value);
    this.onChange(this.value);
    this.stateChanges.next();
  }
  get value() {
    return xss.filterXSS(this._value);
  }

  @Input()
  set tabindex(value: string) {
    this._tabindex = value;
    this.renderer.setAttribute(this.txe.nativeElement, 'tabindex', this._tabindex);
  }
  get tabindex() {
    return this._tabindex;
  }

  @Input()
  set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  get disabled() {
    return this._disabled;
  }

  get empty() {
    if (this._value) {
      return this._value.length < 1;
    } else {
      return true;
    }
  }

  @Output() valueChange: EventEmitter<string> = new EventEmitter<string>();
  @Output() onfocus: EventEmitter<void> = new EventEmitter<void>();
  @Output() onblur: EventEmitter<void> = new EventEmitter<void>();

  error: string;
  touched = false;

  onChange = (delta: any) => {};
  onTouched = () => {
    this.touched = true;
  }

  constructor(
    private elRef: ElementRef,
    public ngControl: NgControl,
    private fm: FocusMonitor,
    private renderer: Renderer2,
    private sanitizer: DomSanitizer
  ) {
    fm.monitor(elRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      this.stateChanges.next();
    });

    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(value: any): void { this.value = value; }
  registerOnChange(fn: (v: any) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  ngDoCheck(): void {
    if (this.ngControl) {
      this.errorState = this.ngControl.invalid && this.ngControl.touched;
      this.stateChanges.next();
    }
  }
  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }
  onContainerClick(event: MouseEvent) {
    const el = event.target as Element;
    if (el.getAttribute('class') && el.getAttribute('class').toLowerCase() !== 'txe-field') {
      this.txe.nativeElement.focus();
    }
  }

  ngAfterViewInit() {
    // this.txe.nativeElement.innerHTML = this.value;
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
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
    // Now process everything
    let child = this.txe.nativeElement.firstChild;
    const sel = window.getSelection();
    const curNode = sel.anchorNode;
    const curOffset = sel.anchorOffset;

    while (child) {
      if (child.nodeType === 3) {
        this.moveElementToChild(child, 'p');
        sel.setPosition(curNode, curOffset);
      } else if (child.nodeType === 1) {
        switch (child.nodeName.toLowerCase()) {
          case 'b':
            this.moveElementToChild(child, 'p');
            sel.setPosition(curNode, curOffset);
            break;
          case 'span':
            this.moveElementToChild(child, 'p');
            sel.setPosition(curNode, curOffset);
            break;
        }
      }
      // Now continue to the next child
      child = this.renderer.nextSibling(child);
    }

    const isEmpty = this.txe.nativeElement.innerText.trim().length <= 0;
    if (isEmpty) {
      this.renderer.setAttribute(this.txe.nativeElement, 'innerHTML', '');
    }

    this._value = this.txe.nativeElement.innerHTML;
    this.valueChange.emit();
    this.onChange(this.value);
    this.stateChanges.next();
  }

  public doFocus(event: any) {
    this.onfocus.emit();
  }

  public doBlur(event: any) {
    this.process();
    this.onTouched();
    this.onblur.emit();
  }

  private moveElementToChild(child: any, newTag: string) {
    const newEle = this.renderer.createElement(newTag);
    this.renderer.insertBefore(this.renderer.parentNode(child), newEle, child);
    this.renderer.appendChild(newEle, child);
  }

  public toggleBold(event: any) {
    // event.preventDefault();
    document.execCommand('bold');
    this.txe.nativeElement.focus();
  }

  public toggleItalic(event: any) {
    // event.preventDefault();
    document.execCommand('italic');
    this.txe.nativeElement.focus();
  }

  public toggleUnderline(event: any) {
    // event.preventDefault();
    document.execCommand('underline');
    this.txe.nativeElement.focus();
  }

  public chg() {
    console.log('change?');
  }

}
