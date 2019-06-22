import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  fgroup: FormGroup;
  loading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.fgroup = this.fb.group({
      title: ['', [Validators.required]],
      tags: ['', [Validators.required]],
      description: ['', [Validators.required]],
      genre: ['', [Validators.required]]
    });
  }

  get form() {
    return this.fgroup.controls;
  }

  public onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    //this.alertService.clear();

    // stop here if form is invalid
    if (this.fgroup.invalid) {
      return;
    }
    this.loading = true;
  }
}
