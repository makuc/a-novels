import { Component, OnInit, Input, ViewChild, HostBinding, ElementRef, Renderer2, forwardRef, OnChanges } from '@angular/core';
import { NgControl, FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Component({
  selector: 'app-file-select',
  templateUrl: './file-select.component.html',
  styleUrls: ['./file-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileSelectComponent),
      multi: true
    }
  ]
})
export class FileSelectComponent implements ControlValueAccessor {

  static nextId = 0;

  // tslint:disable: variable-name
  private _multiple: boolean;
  private _id = `fileselect-${FileSelectComponent.nextId++}`;
  private _preview = false;
  private _accept: string;
  // tslint:enable: variable-name
  previewSrcs: string[] = [];
  touched = false;

  @Input()
  set multiple(value: boolean) {
    this._multiple = coerceBooleanProperty(value);
  }
  get multiple() {
    return this._multiple;
  }

  @Input()
  set id(value: string) {
    this._id = value;
  }
  get id() {
    return this._id;
  }

  @Input()
  set value(value: FileList) {
    this.file.nativeElement.files = value;
    this.update();
  }
  get value(): FileList {
    return this.file.nativeElement.files;
  }

  @Input()
  set preview(value: boolean) {
    this._preview = coerceBooleanProperty(value);
  }
  get preview(): boolean {
    return this._preview;
  }

  @Input()
  set accept(value: string) {
    this._accept = value;
  }
  get accept(): string {
    return this._accept;
  }


  @ViewChild('msg', { static: true }) msg: ElementRef<HTMLElement>;
  @ViewChild('fileInput', { static: true }) file: ElementRef<HTMLInputElement>;
  @HostBinding('attr.id') hostId = null;

  onChange = (delta: any) => { };
  onTouched = () => {
    this.touched = true;
  }

  writeValue(files: FileList) {
    this.value = files;
  }
  registerOnChange(fn: (v: any) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  constructor(
    private renderer: Renderer2
  ) { }

  onFocus() {
    this.renderer.addClass(this.file.nativeElement, 'has-focus');
  }
  onBlur() {
    this.renderer.removeClass(this.file.nativeElement, 'has-focus');
    this.onTouched();
  }

  update() {
    if (this.msg.nativeElement.firstChild) {
      this.renderer.removeChild(this.msg.nativeElement, this.msg.nativeElement.firstChild);
    }
    if (this.value.length > 0) {
      const txt = this.renderer.createText(`${this.value.length} file(s) selected`);
      this.renderer.appendChild(this.msg.nativeElement, txt);

      if (this.preview) {
        this.genPreviews(this.value);
      }

    } else {
      const txt = this.renderer.createText(`No file(s) selected...`);
      this.renderer.appendChild(this.msg.nativeElement, txt);
    }
    // Controller register changes
    this.onChange(this.value);
  }

  genPreviews(files: FileList) {
    this.previewSrcs = [];
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < files.length; i++) {
      if (files[i].type.match(/image\/*/) == null) {
        // tslint:disable-next-line: no-console
        console.info('Not image');
        continue;
      }
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewSrcs.push(e.target.result);
      };
      reader.readAsDataURL(files[i]);
    }
  }

}
