import {
  Component,
  ElementRef,
  Renderer2,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
  DoCheck,
  HostBinding,
  ViewChild,
  HostListener
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';
import { Subject } from 'rxjs';
import { FocusMonitor } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'app-rating-selector',
  templateUrl: './rating-selector.component.html',
  styleUrls: ['./rating-selector.component.scss'],
  providers: [
    {
      provide: MatFormFieldControl,
      useExisting: RatingSelectorComponent
    }
  ]
})
export class RatingSelectorComponent
       implements ControlValueAccessor,
                  MatFormFieldControl<number>,
                  OnDestroy,
                  DoCheck {

  static nextId = 0;

  // tslint:disable: variable-name
  private _placeholder: string;
  private _required: boolean;
  private _tabindex = '0';
  private _disabled: boolean;
  private _id: string;
  private _value = 0;
  // tslint:enable: variable-name

  focused = false;
  stateChanges = new Subject<void>();
  controlType = 'rts';
  errorState = false;

  @HostBinding('attr.id') hostId = `rts-${RatingSelectorComponent.nextId++}`;
  @HostBinding('attr.tabindex') hostTabindex = null;
  @HostBinding('class.floating')
  get shouldLabelFloat() {
    return true; // We want label to ALWAYS float!
  }
  @HostBinding('attr.aria-describedby') describedBy = '';

  @ViewChild('rs1', { static: true }) rs1: ElementRef<HTMLButtonElement>;
  @ViewChild('rs2', { static: true }) rs2: ElementRef<HTMLButtonElement>;
  @ViewChild('rs3', { static: true }) rs3: ElementRef<HTMLButtonElement>;
  @ViewChild('rs4', { static: true }) rs4: ElementRef<HTMLButtonElement>;
  @ViewChild('rs5', { static: true }) rs5: ElementRef<HTMLButtonElement>;
  @ViewChild('rsreset', { static: true }) rsreset: ElementRef<HTMLButtonElement>;

  @Input()
  set id(value: string) {
    this._id = value;
    // this.renderer.setAttribute(this.txe.nativeElement, 'id', this._id);
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
  set value(value: number) {
    this._value = value;
    this.onChange(this.value);
    this.stateChanges.next();
  }
  get value() {
    return this._value;
  }

  @Input()
  set tabindex(value: string) {
    this._tabindex = value;
    // this.renderer.setAttribute(this.txe.nativeElement, 'tabindex', this._tabindex);
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
    const isEmpty = this._value < 1 || this._value > 5;
    return isEmpty;
  }

  error: string;
  touched = false;

  onChange = (delta: any) => {};
  onTouched = () => {
    this.touched = true;
  }

  @HostListener('keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') {
      switch (document.activeElement) {
        case this.rs1.nativeElement:
          this.rs2.nativeElement.focus();
          break;
        case this.rs2.nativeElement:
          this.rs3.nativeElement.focus();
          break;
        case this.rs3.nativeElement:
          this.rs4.nativeElement.focus();
          break;
        case this.rs4.nativeElement:
          this.rs5.nativeElement.focus();
          break;
        case this.rs5.nativeElement:
          this.rsreset.nativeElement.focus();
          break;
      }
    } else if (event.key === 'ArrowLeft') {
      switch (document.activeElement) {
        case this.rs2.nativeElement:
          this.rs1.nativeElement.focus();
          break;
        case this.rs3.nativeElement:
          this.rs2.nativeElement.focus();
          break;
        case this.rs4.nativeElement:
          this.rs3.nativeElement.focus();
          break;
        case this.rs5.nativeElement:
          this.rs4.nativeElement.focus();
          break;
        case this.rsreset.nativeElement:
          this.rs5.nativeElement.focus();
          break;
      }
    }
  }

  constructor(
    private elRef: ElementRef,
    public ngControl: NgControl,
    private fm: FocusMonitor
  ) {
    fm.monitor(elRef.nativeElement, true).subscribe(origin => {
      this.focused = !!origin;
      if (!this.focused) {
        this.onTouched();
      }
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
    const pel = el.parentElement;
    if (
      el.getAttribute('class') && !el.getAttribute('class').toLowerCase().split(' ').includes('rate-btn') &&
      pel.getAttribute('class') && !pel.getAttribute('class').toLowerCase().split(' ').includes('rate-btn')
    ) {
      this.rs1.nativeElement.focus();
    }
  }

  ngOnDestroy() {
    this.stateChanges.complete();
    this.fm.stopMonitoring(this.elRef.nativeElement);
  }

  rate(value: number) {
    this.value = value;
    this.onChange(this.value);
    this.stateChanges.next();
  }

  val(valueSet: number) {
    return this.value >= valueSet;
  }

}
