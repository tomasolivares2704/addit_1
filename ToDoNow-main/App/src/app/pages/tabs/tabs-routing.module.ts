import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'profile',
        loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
      },
      {
        path: 'inventory',
        loadChildren: () => import('./inventory/inventory.module').then( m => m.InventoryPageModule)
      },
      {
        path: 'inventario',
        loadChildren: () => import('./inventario/inventario.module').then( m => m.InventarioPageModule)
      },
      {
        path: 'recetas',
        loadChildren: () => import('./recetas/recetas.module').then( m => m.RecetasPageModule)
      },
      {
        path: 'listacompras',
        loadChildren: () => import('./listacompras/listacompras.module').then( m => m.ListacomprasPageModule)
      },
      {
        path: 'detalle-lista/:id',
        loadChildren: () => import('./detalle-lista/detalle-lista.module').then( m => m.DetalleListaPageModule)
      },
      {
        path: 'formfood',
        loadChildren: () => import('./formfood/formfood.module').then( m => m.FormfoodPageModule)
      },
      {
        path: 'formreceta',
        loadChildren: () => import('./formreceta/formreceta.module').then( m => m.FormrecetaPageModule)
      },
      {
        path: 'detalle-lista/:id/select-products',
        loadChildren: () => import('./select-product/select-product.module').then(m => m.SelectProductPageModule)
      },
      {
        path: 'newlist',
        loadChildren: () => import('./newlist/newlist.module').then( m => m.NewlistPageModule)
      },
      {
        path: 'detnewlist/:id',
        loadChildren: () => import('./detnewlist/detnewlist.module').then( m => m.DetnewlistPageModule)
      },
      {
        path: 'testcam',
        loadChildren: () => import('./testcam/testcam.module').then( m => m.TestcamPageModule)
      },
    
    ],
  },
  
 

  


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
