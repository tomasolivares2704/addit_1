import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule

import { FormrecetaPageRoutingModule } from './formreceta-routing.module';
import { FormrecetaPage } from './formreceta.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { InventoryPageModule } from '../inventory/inventory.module';
import { InventarioPageRoutingModule } from '../inventario/inventario-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormrecetaPageRoutingModule,
    ReactiveFormsModule, // Agrega ReactiveFormsModule aquí
    SharedModule,
    InventoryPageModule,
    InventarioPageRoutingModule
  ],
  declarations: [FormrecetaPage]
})
export class FormrecetaPageModule {}
