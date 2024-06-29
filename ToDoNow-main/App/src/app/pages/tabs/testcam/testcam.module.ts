import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestcamPageRoutingModule } from './testcam-routing.module';

import { TestcamPage } from './testcam.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestcamPageRoutingModule
  ],
  declarations: [TestcamPage]
})
export class TestcamPageModule {}
