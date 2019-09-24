/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditTXEComponent } from './edit-txe.component';

describe('EditTXEComponent', () => {
  let component: EditTXEComponent;
  let fixture: ComponentFixture<EditTXEComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTXEComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTXEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
