import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetnewlistPageRoutingModule } from './detnewlist-routing.module';

import { DetnewlistPage } from './detnewlist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetnewlistPageRoutingModule
  ],
  declarations: [DetnewlistPage]
})
export class DetnewlistPageModule {}
