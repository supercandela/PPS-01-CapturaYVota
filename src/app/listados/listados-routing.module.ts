import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListadosPage } from './listados.page';

const routes: Routes = [
  {
    path: '',
    component: ListadosPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListadosPageRoutingModule {}
