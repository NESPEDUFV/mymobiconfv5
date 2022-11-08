import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OpcoesEnviarPerguntasPage } from './opcoes-enviar-perguntas.page';

describe('OpcoesEnviarPerguntasPage', () => {
  let component: OpcoesEnviarPerguntasPage;
  let fixture: ComponentFixture<OpcoesEnviarPerguntasPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OpcoesEnviarPerguntasPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OpcoesEnviarPerguntasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
