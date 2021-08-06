import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RankingPerguntasPageRoutingModule } from './ranking-perguntas-routing.module';

import { RankingPerguntasPage } from './ranking-perguntas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RankingPerguntasPageRoutingModule
  ],
  declarations: [RankingPerguntasPage]
})
export class RankingPerguntasPageModule {}
