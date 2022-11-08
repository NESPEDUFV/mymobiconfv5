import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalasOffTopicPageRoutingModule } from './salas-off-topic-routing.module';

import { SalasOffTopicPage } from './salas-off-topic.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalasOffTopicPageRoutingModule
  ],
  declarations: [SalasOffTopicPage]
})
export class SalasOffTopicPageModule {}
