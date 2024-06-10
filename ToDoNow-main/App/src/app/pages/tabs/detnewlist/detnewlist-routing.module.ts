import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetnewlistPage } from './detnewlist.page';

const routes: Routes = [
  {
    path: '',
    component: DetnewlistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetnewlistPageRoutingModule {}
