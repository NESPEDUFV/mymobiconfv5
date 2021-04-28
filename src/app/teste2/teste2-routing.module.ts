import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Teste2Page } from './teste2.page';

const routes: Routes = [
  {
    path: '',
    component: Teste2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Teste2PageRoutingModule {}
