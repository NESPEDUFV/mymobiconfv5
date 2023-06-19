import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { NavegacaoPage } from './navegacao.page';
import { NavegacaoPageRoutingModule } from './navegacao-routing.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NavegacaoPageRoutingModule
  ],
  declarations: [NavegacaoPage],
})
export class NavegacaoPageModule {}
