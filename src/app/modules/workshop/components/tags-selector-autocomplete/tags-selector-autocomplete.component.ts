import { COMMA, ENTER, SEMICOLON } from '@angular/cdk/keycodes';
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
  selector: 'app-tags-selector-autocomplete',
  templateUrl: './tags-selector-autocomplete.component.html',
  styleUrls: ['./tags-selector-autocomplete.component.scss']
})
export class TagsSelectorAutocompleteComponent {

  @Input() required = false;
  @Input() selectable = true;
  @Input() removable = true;
  @Input() addOnBlur = true;
  @Input() separatorKeysCodes: number[] = [ENTER, COMMA, SEMICOLON];
  @Input() tagsCtrl = new FormControl();
  @Input() possibleTags: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  tags: string[] = [];
  searchTags: Observable<string[]>;

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('tagSelector') matAutocomplete: MatAutocomplete;

  constructor() {
    this.searchTags = this.tagsCtrl.valueChanges
      .pipe(
        startWith(null),
        map((tag: string | null) => {
          if (tag) {
            return this._filter(tag);
          } else {
            return this.possibleTags;
          }
        })
      );
  }

  add(event: MatChipInputEvent): void {
    // Add tag only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our tag
      if ((value || '').trim()) {
        const tag = value.trim();
        if (this.tags.indexOf(tag) < 0) {
          this.tags.push(tag);
        }
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.tagsCtrl.setValue(null);
    }
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (this.tags.indexOf(event.option.viewValue) < 0) {
      this.tags.push(event.option.viewValue);
    }
    this.tagInput.nativeElement.value = '';
    this.tagsCtrl.setValue(null);
  }

  private _filter(search: string): string[] {
    const iSearch = search.toLowerCase();
    return this.possibleTags.filter(tag => tag.toLowerCase().indexOf(iSearch) === 0);
  }

}
