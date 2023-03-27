import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AlbumEventoPage } from './album-evento.page';

const routes: Routes = [
  {
    path: '',
    component: AlbumEventoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AlbumEventoPageRoutingModule {}
