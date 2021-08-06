import { TestBed } from '@angular/core/testing';

import { SalasOffTopicService } from './salas-off-topic.service';

describe('SalasOffTopicService', () => {
  let service: SalasOffTopicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalasOffTopicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
