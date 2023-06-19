import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { EscolherDestinoPage } from './escolher-destino.page';
import { EscolherDestinoPageRoutingModule } from './escolher-destino-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EscolherDestinoPageRoutingModule
  ],
  declarations: [EscolherDestinoPage]
})
export class EscolherDestinoPageModule {}
