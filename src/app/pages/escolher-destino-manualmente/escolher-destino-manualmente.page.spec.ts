import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EscolherDestinoManualmentePage } from './escolher-destino-manualmente.page';

describe('EscolherDestinoManualmentePage', () => {
  let component: EscolherDestinoManualmentePage;
  let fixture: ComponentFixture<EscolherDestinoManualmentePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EscolherDestinoManualmentePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EscolherDestinoManualmentePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
