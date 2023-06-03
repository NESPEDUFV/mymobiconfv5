import { TutorialComponent } from './../../../components/tutorial/tutorial.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilGamePageRoutingModule } from './perfil-game-routing.module';

import { PerfilGamePage } from './perfil-game.page';
import { SharedModule } from 'src/app/components/shared.module';
import { PipesModule } from 'src/app/pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilGamePageRoutingModule,
    SharedModule,
    PipesModule,

  ],
  declarations: [PerfilGamePage,],
  providers: [FormBuilder]
})
export class PerfilGamePageModule {}
