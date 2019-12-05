import { COMMA, ENTER, SEMICOLON, FF_SEMICOLON, SPACE, MAC_ENTER } from '@angular/cdk/keycodes';
import { Component, Input, ViewChild, ElementRef, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

export interface Fruit {
  name: string;
}

/**
 * @title Simple Tag Selector
 */
@Component({
  selector: 'app-tags-selector',
  templateUrl: './tags-selector.component.html',
  styleUrls: ['./tags-selector.component.scss']
})
export class TagsSelectorComponent {

  @Input() required = false;
  @Input() selectable = true;
  @Input() removable = true;
  @Input() addOnBlur = true;
  @Input() separatorKeysCodes: number[] = [SEMICOLON, ENTER, MAC_ENTER, COMMA, FF_SEMICOLON, SPACE];
  @Input() tagsCtrl = new FormControl();

  inputCtrl = new FormControl();

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;

  constructor() { }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our tag
    if ((value || '').trim()) {
      const tag = value.trim();
      if (this.tagsCtrl.value.indexOf(tag) < 0) {
        this.tagsCtrl.value.push(tag);
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.tagsCtrl.updateValueAndValidity();
    this.tagsCtrl.markAsDirty();
  }

  remove(tag: string): void {
    const index = this.tagsCtrl.value.indexOf(tag);

    if (index >= 0) {
      this.tagsCtrl.value.splice(index, 1);
    }
    this.tagsCtrl.updateValueAndValidity();
    this.tagsCtrl.markAsDirty();
  }

}
