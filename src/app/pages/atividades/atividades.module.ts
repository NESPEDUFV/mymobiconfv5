import { PipesModule } from './../../pipes/pipes.module';
import { DatasPipe } from './../../pipes/datas.pipe';
import { SharedModule } from './../../components/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AtividadesPageRoutingModule } from './atividades-routing.module';

import { AtividadesPage } from './atividades.page';
//import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AtividadesPageRoutingModule,
    SharedModule,
    PipesModule,

  ],
  declarations: [AtividadesPage]
})
export class AtividadesPageModule {}
