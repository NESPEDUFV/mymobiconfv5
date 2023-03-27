import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AlbumEventoPageRoutingModule } from './album-evento-routing.module';

import { AlbumEventoPage } from './album-evento.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AlbumEventoPageRoutingModule
  ],
  declarations: [AlbumEventoPage]
})
export class AlbumEventoPageModule {}
