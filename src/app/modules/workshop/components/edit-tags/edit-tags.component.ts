import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GenresService } from 'src/app/core/services/genres.service';
import { Genre } from 'src/app/shared/models/novels/genre.model';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ArrayValidators } from 'src/app/shared/validators/array.validators';
import { MatChipList, MatChipInputEvent } from '@angular/material';
import { SEMICOLON, ENTER, MAC_ENTER, COMMA, FF_SEMICOLON, SPACE } from '@angular/cdk/keycodes';

export interface DataInput {
  value: Genre[];
  placeholder: string;
}

@Component({
  selector: 'app-edit-tags',
  templateUrl: './edit-tags.component.html',
  styleUrls: ['./edit-tags.component.scss']
})
export class EditTagsComponent {

  ctrl: FormControl;
  separatorKeysCodes: number[] = [SEMICOLON, ENTER, MAC_ENTER, COMMA, FF_SEMICOLON, SPACE];
  @ViewChild('tagInput', { static: false }) tagInput: ElementRef<HTMLInputElement>;

  constructor(
    public dialogRef: MatDialogRef<EditTagsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataInput,
  ) {
    this.ctrl = new FormControl([...data.value]);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our tag
    if ((value || '').trim()) {
      const tag = value.trim();
      if (this.ctrl.value.indexOf(tag) < 0) {
        this.ctrl.value.push(tag);
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.ctrl.updateValueAndValidity();
    this.ctrl.markAsDirty();
  }

  remove(tag: string): void {
    const index = this.ctrl.value.indexOf(tag);

    if (index >= 0) {
      this.ctrl.value.splice(index, 1);
    }
    this.ctrl.updateValueAndValidity();
    this.ctrl.markAsDirty();
  }

  compareTag(tag1: string, tag2: string) {
    return tag1.toLowerCase() === tag2.toLowerCase();
  }
}
