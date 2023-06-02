import { DatasPipe } from 'src/app/pipes/datas.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [DatasPipe],
  imports: [
    CommonModule,
  ],
  exports: [
    DatasPipe,
  ]
})
export class PipesModule { }
