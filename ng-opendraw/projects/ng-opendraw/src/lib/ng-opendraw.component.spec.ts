import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgOpendrawComponent } from './ng-opendraw.component';

describe('NgOpendrawComponent', () => {
  let component: NgOpendrawComponent;
  let fixture: ComponentFixture<NgOpendrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgOpendrawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgOpendrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
