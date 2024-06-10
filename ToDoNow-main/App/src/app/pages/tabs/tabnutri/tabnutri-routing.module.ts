import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabnutriPage } from './tabnutri.page';

const routes: Routes = [
  {
    path: '',
    component: TabnutriPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabnutriPageRoutingModule {}
