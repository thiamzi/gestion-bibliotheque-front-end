import { TestBed } from '@angular/core/testing';

import { GardeService } from './garde.service';

describe('GardeService', () => {
  let service: GardeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GardeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
