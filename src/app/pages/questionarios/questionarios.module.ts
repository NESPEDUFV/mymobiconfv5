import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuestionariosPageRoutingModule } from './questionarios-routing.module';

import { QuestionariosPage } from './questionarios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuestionariosPageRoutingModule
  ],
  declarations: [QuestionariosPage]
})
export class QuestionariosPageModule {}
