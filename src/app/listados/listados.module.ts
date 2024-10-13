import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListadosPageRoutingModule } from './listados-routing.module';

import { ListadosPage } from './listados.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ListadosPageRoutingModule],
  declarations: [ListadosPage],
})
export class ListadosPageModule {}
