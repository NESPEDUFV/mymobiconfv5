import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RankingPerguntasPage } from './ranking-perguntas.page';

const routes: Routes = [
  {
    path: '',
    component: RankingPerguntasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RankingPerguntasPageRoutingModule {}
