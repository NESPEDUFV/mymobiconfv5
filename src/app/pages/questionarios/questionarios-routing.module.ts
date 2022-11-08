import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuestionariosPage } from './questionarios.page';

const routes: Routes = [
  {
    path: '',
    component: QuestionariosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuestionariosPageRoutingModule {}
