import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FormfoodPage } from './formfood.page';

const routes: Routes = [
  {
    path: '',
    component: FormfoodPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FormfoodPageRoutingModule {}
