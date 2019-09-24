/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CoverReuploadComponent } from './cover-reupload.component';

describe('CoverReuploadComponent', () => {
  let component: CoverReuploadComponent;
  let fixture: ComponentFixture<CoverReuploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoverReuploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverReuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
