import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AtividadeInfoPage } from './atividade-info.page';

const routes: Routes = [
  {
    path: '',
    component: AtividadeInfoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AtividadeInfoPageRoutingModule {}
