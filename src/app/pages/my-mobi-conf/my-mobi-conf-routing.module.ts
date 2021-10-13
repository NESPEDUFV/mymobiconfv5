import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyMobiConfPage } from './my-mobi-conf.page';

const routes: Routes = [
  {
    path: '',
    component: MyMobiConfPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyMobiConfPageRoutingModule {}
