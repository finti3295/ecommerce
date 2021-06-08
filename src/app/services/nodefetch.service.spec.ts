import { TestBed } from '@angular/core/testing';

import { NodefetchService } from './nodefetch.service';

describe('NodefetchService', () => {
  let service: NodefetchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NodefetchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
