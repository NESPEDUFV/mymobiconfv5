import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EventoInfoPageRoutingModule } from './evento-info-routing.module';

import { EventoInfoPage } from './evento-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventoInfoPageRoutingModule
  ],
  declarations: [EventoInfoPage]
})
export class EventoInfoPageModule {}
