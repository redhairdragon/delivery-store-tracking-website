import { TestBed } from '@angular/core/testing';

import { AdminAccessorService } from './admin-accessor.service';

describe('AdminAccessorService', () => {
  let service: AdminAccessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminAccessorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
