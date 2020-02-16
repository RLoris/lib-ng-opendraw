import { TestBed } from '@angular/core/testing';

import { NgOpendrawService } from './ng-opendraw.service';

describe('NgOpendrawService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NgOpendrawService = TestBed.get(NgOpendrawService);
    expect(service).toBeTruthy();
  });
});
