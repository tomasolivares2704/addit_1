import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetalleListaPageRoutingModule } from './detalle-lista-routing.module';

import { DetalleListaPage } from './detalle-lista.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetalleListaPageRoutingModule
  ],
  declarations: [DetalleListaPage]
})
export class DetalleListaPageModule {}
