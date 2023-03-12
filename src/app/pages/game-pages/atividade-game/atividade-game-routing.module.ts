import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AtividadeGamePage } from './atividade-game.page';

const routes: Routes = [
  {
    path: '',
    component: AtividadeGamePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AtividadeGamePageRoutingModule {}
