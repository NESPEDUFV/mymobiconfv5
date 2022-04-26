import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AtividadeInfoPageRoutingModule } from './atividade-info-routing.module';

import { AtividadeInfoPage } from './atividade-info.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AtividadeInfoPageRoutingModule
  ],
  declarations: [AtividadeInfoPage]
})
export class AtividadeInfoPageModule {}
