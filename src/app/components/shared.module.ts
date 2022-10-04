import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutorialComponent } from './tutorial/tutorial.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [TutorialComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    TutorialComponent
  ]
})
export class SharedModule { }
