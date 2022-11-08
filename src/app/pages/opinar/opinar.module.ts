import { TutorialComponent } from './../../components/tutorial/tutorial.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OpinarPageRoutingModule } from './opinar-routing.module';

import { OpinarPage } from './opinar.page';
import { SharedModule } from 'src/app/components/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OpinarPageRoutingModule,
    SharedModule,

  ],
  declarations: [OpinarPage]
})
export class OpinarPageModule {}
