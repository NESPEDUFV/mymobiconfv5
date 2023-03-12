import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilGamePageRoutingModule } from './perfil-game-routing.module';

import { PerfilGamePage } from './perfil-game.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilGamePageRoutingModule
  ],
  declarations: [PerfilGamePage]
})
export class PerfilGamePageModule {}
