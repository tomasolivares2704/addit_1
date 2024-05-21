import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetallelistaPageRoutingModule } from './detallelista-routing.module';

import { DetallelistaPage } from './detallelista.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetallelistaPageRoutingModule
  ],
  declarations: [DetallelistaPage]
})
export class DetallelistaPageModule {}
