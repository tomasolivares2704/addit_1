import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Foods, CategoriaAlimento } from 'src/app/models/food.models';
import { User } from 'src/app/models/user.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
})
export class InventarioPage implements OnInit {

  user = {} as User;
  foods: Foods[] = [];
  loading: boolean = false;
  selectedCategoria: CategoriaAlimento; // Variable para almacenar la categoría seleccionada
  categorias: CategoriaAlimento[] = Object.values(CategoriaAlimento); // Array de categorías

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getUser();
    this.getAllFoods();
  }

  getUser() {
    this.user = this.utilsSvc.getElementInLocalStorage('user');
    if (this.user && this.user.isAdmin) {
      this.utilsSvc.setElementInLocalStorage('isAdmin', true);
    }
  }

  getAllFoods() {
    this.loading = true;
    this.firebaseSvc.getAllFoods().subscribe(foods => {
      this.foods = foods;
      this.loading = false;
      console.log('Alimentos recibidos:', foods);
    });
  }

  // Método para filtrar los alimentos por categoría
  filterByCategoria() {
    // Aquí podrías aplicar algún procesamiento adicional si es necesario
  }

  // Método para resetear el filtro y mostrar todos los alimentos
  resetFilter() {
    this.selectedCategoria = null;
  }

  // Propiedad calculada para almacenar los alimentos filtrados
  get filteredFoods(): Foods[] {
    if (!this.selectedCategoria) {
      return this.foods; // Devuelve todos los alimentos si no hay categoría seleccionada
    }
    return this.foods.filter(food => food.categoria === this.selectedCategoria);
  }

  // Método para redirigir a la vista de detalles del alimento
  viewFoodDetails(foodId: string) {
    this.router.navigate(['/tabs/tabnutri', foodId]);
  }

}
