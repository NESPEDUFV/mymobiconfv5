import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PerfilGamePage } from './perfil-game.page';

const routes: Routes = [
  {
    path: '',
    component: PerfilGamePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PerfilGamePageRoutingModule {}
