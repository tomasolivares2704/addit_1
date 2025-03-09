import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FormfoodPageRoutingModule } from './formfood-routing.module';

import { FormfoodPage } from './formfood.page';
import { ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FormfoodPageRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [FormfoodPage]
})
export class FormfoodPageModule {}
