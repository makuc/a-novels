import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DataInput {
  value: string;
  placeholder: string;
}

@Component({
  selector: 'app-edit-txe',
  templateUrl: './edit-txe.component.html',
  styleUrls: ['./edit-txe.component.scss']
})
export class EditTXEComponent {

  constructor(
    public dialogRef: MatDialogRef<EditTXEComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DataInput
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
