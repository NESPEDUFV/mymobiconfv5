import { TestBed } from '@angular/core/testing';

import { RedeService } from './rede.service';

describe('RedeService', () => {
  let service: RedeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RedeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
