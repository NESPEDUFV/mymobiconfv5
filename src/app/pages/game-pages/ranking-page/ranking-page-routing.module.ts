import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RankingPagePage } from './ranking-page.page';

const routes: Routes = [
  {
    path: '',
    component: RankingPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RankingPagePageRoutingModule {}
