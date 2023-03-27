import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AtividadeGamePageRoutingModule } from './atividade-game-routing.module';

import { AtividadeGamePage } from './atividade-game.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AtividadeGamePageRoutingModule
  ],
  declarations: [AtividadeGamePage]
})
export class AtividadeGamePageModule {}
