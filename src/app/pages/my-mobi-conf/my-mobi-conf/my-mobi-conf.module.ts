import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyMobiConfPageRoutingModule } from './my-mobi-conf-routing.module';

import { MyMobiConfPage } from './my-mobi-conf.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyMobiConfPageRoutingModule
  ],
  declarations: [MyMobiConfPage]
})
export class MyMobiConfPageModule {}
