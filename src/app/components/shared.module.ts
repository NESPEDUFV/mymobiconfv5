import { AvaliacaoComponent } from './avaliacao/avaliacao.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutorialComponent } from './tutorial/tutorial.component';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [TutorialComponent, AvaliacaoComponent],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    TutorialComponent,
    AvaliacaoComponent
  ]
})
export class SharedModule { }
