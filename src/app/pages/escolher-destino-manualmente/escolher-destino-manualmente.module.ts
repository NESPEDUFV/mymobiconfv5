import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { EscolherDestinoManualmentePage } from './escolher-destino-manualmente.page';
import { EscolherDestinoManualmentePageRoutingModule } from './escolher-destino-manualmente-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EscolherDestinoManualmentePageRoutingModule
  ],
  declarations: [EscolherDestinoManualmentePage]
})
export class EscolherDestinoManualmentePageModule {}
