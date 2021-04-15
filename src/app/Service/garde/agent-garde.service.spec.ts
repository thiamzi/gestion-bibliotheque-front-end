import { TestBed } from '@angular/core/testing';

import { AgentGardeService } from './agent-garde.service';

describe('AgentGardeService', () => {
  let service: AgentGardeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgentGardeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
