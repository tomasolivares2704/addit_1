import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestcamPage } from './testcam.page';

const routes: Routes = [
  {
    path: '',
    component: TestcamPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestcamPageRoutingModule {}
