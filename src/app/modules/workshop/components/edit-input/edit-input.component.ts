import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DataInput {
  value: string;
  placeholder: string;
}

@Component({
  selector: 'app-edit-input',
  templateUrl: './edit-input.component.html',
  styleUrls: ['./edit-input.component.scss']
})
export class EditInputComponent {

  constructor(
    public dialogRef: MatDialogRef<EditInputComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataInput
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
