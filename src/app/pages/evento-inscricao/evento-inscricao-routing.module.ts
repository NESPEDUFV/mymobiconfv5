import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventoInscricaoPage } from './evento-inscricao.page';

const routes: Routes = [
  {
    path: '',
    component: EventoInscricaoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventoInscricaoPageRoutingModule {}
