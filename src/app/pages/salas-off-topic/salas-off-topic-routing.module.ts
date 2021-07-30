import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SalasOffTopicPage } from './salas-off-topic.page';

const routes: Routes = [
  {
    path: '',
    component: SalasOffTopicPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalasOffTopicPageRoutingModule {}
