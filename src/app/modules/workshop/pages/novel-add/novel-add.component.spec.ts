/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NovelAddComponent } from './novel-add.component';

describe('NovelAddComponent', () => {
  let component: NovelAddComponent;
  let fixture: ComponentFixture<NovelAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NovelAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NovelAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
