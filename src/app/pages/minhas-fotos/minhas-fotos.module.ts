import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MinhasFotosPageRoutingModule } from './minhas-fotos-routing.module';

import { MinhasFotosPage } from './minhas-fotos.page';
import { PipesModule } from 'src/app/pipes/pipes.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MinhasFotosPageRoutingModule,
    PipesModule
  ],
  declarations: [MinhasFotosPage]
})
export class MinhasFotosPageModule {}
