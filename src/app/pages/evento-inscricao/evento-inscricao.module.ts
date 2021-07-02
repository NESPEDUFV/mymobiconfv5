import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventoInscricaoPageRoutingModule } from './evento-inscricao-routing.module';

import { EventoInscricaoPage } from './evento-inscricao.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventoInscricaoPageRoutingModule
  ],
  declarations: [EventoInscricaoPage]
})
export class EventoInscricaoPageModule {}
