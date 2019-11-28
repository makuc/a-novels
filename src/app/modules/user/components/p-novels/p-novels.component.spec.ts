/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { PNovelsComponent } from './novels.component';

describe('PNovelsComponent', () => {
  let component: PNovelsComponent;
  let fixture: ComponentFixture<PNovelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PNovelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PNovelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
