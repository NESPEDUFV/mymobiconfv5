import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EscolherDestinoPage } from './escolher-destino.page';

const routes: Routes = [
  {
    path: '',
    component: EscolherDestinoPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EscolherDestinoPageRoutingModule {}
