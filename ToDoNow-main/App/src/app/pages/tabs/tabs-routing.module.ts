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
        path: 'detallelista/:id',
        loadChildren: () => import('./detallelista/detallelista.module').then( m => m.DetallelistaPageModule)
      },
      {
        path: 'tabnutri/:id',
        loadChildren: () => import('./tabnutri/tabnutri.module').then( m => m.TabnutriPageModule)
      },
    
    ],
  },
  



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
