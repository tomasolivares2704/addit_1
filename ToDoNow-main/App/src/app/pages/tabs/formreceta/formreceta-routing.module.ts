import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormrecetaPage } from './formreceta.page';

const routes: Routes = [
  {
    path: '',
    component: FormrecetaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormrecetaPageRoutingModule {}
