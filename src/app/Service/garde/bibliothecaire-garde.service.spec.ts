import { TestBed } from '@angular/core/testing';

import { BibliothecaireGardeService } from './bibliothecaire-garde.service';

describe('BibliothecaireGardeService', () => {
  let service: BibliothecaireGardeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BibliothecaireGardeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
