import { SharedModule } from './../../../components/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RankingPagePageRoutingModule } from './ranking-page-routing.module';

import { RankingPagePage } from './ranking-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RankingPagePageRoutingModule,
    SharedModule
  ],
  declarations: [RankingPagePage]
})
export class RankingPagePageModule {}
