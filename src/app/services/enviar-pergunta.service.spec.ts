import { TestBed } from '@angular/core/testing';

import { EnviarPerguntaService } from './enviar-pergunta.service';

describe('EnviarPerguntaService', () => {
  let service: EnviarPerguntaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnviarPerguntaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
