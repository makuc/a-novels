import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-novel-add',
  templateUrl: './novel-add.component.html',
  styleUrls: ['./novel-add.component.scss']
})
export class NovelAddComponent implements OnInit {
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
