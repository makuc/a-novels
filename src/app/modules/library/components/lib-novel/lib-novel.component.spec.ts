/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LibNovelComponent } from './lib-novel.component';

describe('LibNovelComponent', () => {
  let component: LibNovelComponent;
  let fixture: ComponentFixture<LibNovelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibNovelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibNovelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
