import { TestBed } from '@angular/core/testing';

import { Rede2Service } from './rede2.service';

describe('Rede2Service', () => {
  let service: Rede2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Rede2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
