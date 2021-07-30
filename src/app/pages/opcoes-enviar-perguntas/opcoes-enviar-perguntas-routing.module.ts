import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OpcoesEnviarPerguntasPage } from './opcoes-enviar-perguntas.page';

const routes: Routes = [
  {
    path: '',
    component: OpcoesEnviarPerguntasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OpcoesEnviarPerguntasPageRoutingModule {}
