import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabnutriPageRoutingModule } from './tabnutri-routing.module';

import { TabnutriPage } from './tabnutri.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabnutriPageRoutingModule,
    SharedModule
  ],
  declarations: [TabnutriPage]
})
export class TabnutriPageModule {}
