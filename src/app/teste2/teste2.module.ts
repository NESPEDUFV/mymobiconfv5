import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Teste2PageRoutingModule } from './teste2-routing.module';

import { Teste2Page } from './teste2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Teste2PageRoutingModule
  ],
  declarations: [Teste2Page]
})
export class Teste2PageModule {}
