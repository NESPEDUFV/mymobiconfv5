import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnviarPerguntaPageRoutingModule } from './enviar-pergunta-routing.module';

import { EnviarPerguntaPage } from './enviar-pergunta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnviarPerguntaPageRoutingModule
  ],
  declarations: [EnviarPerguntaPage]
})
export class EnviarPerguntaPageModule {}
