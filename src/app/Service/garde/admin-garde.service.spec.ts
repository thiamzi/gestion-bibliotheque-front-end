import { TestBed } from '@angular/core/testing';

import { AdminGardeService } from './admin-garde.service';

describe('AdminGardeService', () => {
  let service: AdminGardeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminGardeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
