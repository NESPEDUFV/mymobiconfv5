import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatasPipe } from './../../pipes/datas.pipe';

import { IonicModule } from '@ionic/angular';

import { OpcoesEnviarPerguntasPageRoutingModule } from './opcoes-enviar-perguntas-routing.module';

import { OpcoesEnviarPerguntasPage } from './opcoes-enviar-perguntas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OpcoesEnviarPerguntasPageRoutingModule
  ],
  declarations: [OpcoesEnviarPerguntasPage]
})
export class OpcoesEnviarPerguntasPageModule {}
