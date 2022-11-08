import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnviarPerguntaPage } from './enviar-pergunta.page';

const routes: Routes = [
  {
    path: '',
    component: EnviarPerguntaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnviarPerguntaPageRoutingModule {}
