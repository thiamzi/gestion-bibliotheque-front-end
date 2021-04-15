import { TestBed } from '@angular/core/testing';

import { EtudiantGardeService } from './etudiant-garde.service';

describe('EtudiantGardeService', () => {
  let service: EtudiantGardeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EtudiantGardeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
