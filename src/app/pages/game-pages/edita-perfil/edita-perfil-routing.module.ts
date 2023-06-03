import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditaPerfilPage } from './edita-perfil.page';

const routes: Routes = [
  {
    path: '',
    component: EditaPerfilPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditaPerfilPageRoutingModule {}
