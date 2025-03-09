import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SelectProductPageRoutingModule } from './select-product-routing.module';

import { SelectProductPage } from './select-product.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SelectProductPageRoutingModule,
    SharedModule
  ],
  declarations: [SelectProductPage]
})
export class SelectProductPageModule {}
