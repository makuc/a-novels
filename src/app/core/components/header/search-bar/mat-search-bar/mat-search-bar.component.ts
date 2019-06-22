import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Output,
  ViewChild
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Router } from '@angular/router';

import { AbstractControlValueAccessor } from '../utils/abstract-value-accessor';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'mat-search-bar',
  templateUrl: './mat-search-bar.component.html',
  styleUrls: ['./mat-search-bar.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('true', style({ width: '*' })),
      state('false', style({ width: '0' })),
      transition('true => false', animate('300ms ease-in')),
      transition('false => true', animate('300ms ease-out'))
    ])
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MatSearchBarComponent),
      multi: true
    }
  ]
})
export class MatSearchBarComponent extends AbstractControlValueAccessor<string> {
  @ViewChild('input', { static: false }) inputElement: ElementRef;

  @Output() onBlur = new EventEmitter<string>();
  @Output() onClose = new EventEmitter<void>();
  @Output() onEnter = new EventEmitter<string>();
  @Output() onFocus = new EventEmitter<string>();
  @Output() onOpen = new EventEmitter<void>();

  searchVisible = false;

  constructor(private router: Router) {
    super();
  }

  public close(): void {
    this.searchVisible = false;
    this.value = '';
    this.updateChanges();
    this.onClose.emit();
  }

  public open(): void {
    this.searchVisible = true;
    this.inputElement.nativeElement.focus();
    this.onOpen.emit();
  }

  public search(): void {
    this.router.navigate(['search'], { queryParams: { s: this.value } }).then((e) => {
      if (!e) {
        console.log('Navigation failed!');
      }
    });
  }

  onBlurring(searchValue: string) {
    if (!searchValue) {
      this.searchVisible = false;
    }
    this.onBlur.emit(searchValue);
  }

  onEnterring(searchValue: string) {
    this.onEnter.emit(searchValue);
  }

  onFocussing(searchValue: string) {
    this.onFocus.emit(searchValue);
  }

}
