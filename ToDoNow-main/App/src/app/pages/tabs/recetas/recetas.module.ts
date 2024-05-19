import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RecetasPageRoutingModule } from './recetas-routing.module';
import { RecetasPage } from './recetas.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    RecetasPageRoutingModule,
    SharedModule
  ],
  declarations: [RecetasPage]
})
export class RecetasPageModule {}
