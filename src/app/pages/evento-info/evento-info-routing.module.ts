import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventoInfoPage } from './evento-info.page';

const routes: Routes = [
  {
    path: '',
    component: EventoInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventoInfoPageRoutingModule {}
