import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Foods } from 'src/app/models/food.models';

@Component({
  selector: 'app-select-product',
  templateUrl: './select-product.page.html',
  styleUrls: ['./select-product.page.scss'],
})
export class SelectProductPage implements OnInit {

  foods: Foods[] = [];
  selectedProducts: Foods[] = [];
  loading: boolean = false;

  constructor(
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
    private router: Router,
    private utilsService: UtilsService,
  ) {}

  ngOnInit() {
    this.getAllFoods();
    this.getListId();
  }

  toggleProductSelection(foodId: string) {
    const index = this.selectedProducts.findIndex(food => food.id === foodId);
    if (index > -1) {
      this.selectedProducts.splice(index, 1); // Elimina el producto si ya está en el array
    } else {
      const selectedFood = this.foods.find(food => food.id === foodId);
      if (selectedFood) {
        this.selectedProducts.push(selectedFood); // Agrega el producto si no está en el array
      }
    }
    this.updateLocalStorage(); // Actualizar localStorage
    console.log('Selected products:', this.selectedProducts); // Para verificar que los productos se están seleccionando correctamente
  }

  //Actualiza los elementos en el localStorage
  updateLocalStorage() {
    localStorage.setItem('selectedProducts', JSON.stringify(this.selectedProducts));
  }

  clearSelectedProducts() {
    localStorage.removeItem('selectedProducts');
    this.selectedProducts = [];
  }
  getListId() {
    const listId = this.route.snapshot.paramMap.get('id');
    if (!listId) {
      console.error('List ID is missing or invalid');
      return;
    }
    console.log('ID obtenido:', listId);
  }

  addSelectedProducts() {
    const userId = this.utilsService.getElementInLocalStorage('user'); 
    const listId = this.route.snapshot.paramMap.get('id'); 
  
    if (!userId || !listId) {
      console.error('User ID or List ID is missing');
      return;
    }
  
    if (this.selectedProducts.length === 0) {
      console.error('No foods selected');
      this.utilsService.presentToast({
        message: `No has seleccionado ningún producto`,
        duration: 1500,
        color: 'primary',
        icon: 'person-outline',
        mode: 'ios'
      });
      return;
    }
  
    this.loading = true;
    this.firebaseService.addProductsToList(userId, listId, this.selectedProducts)
      .then(() => {
        this.loading = false;
        console.log('Foods added successfully');
        this.utilsService.presentToast({
          message: `Productos añadidos correctamente`,
          duration: 1500,
          color: 'primary',
          icon: 'person-outline',
          mode: 'ios'

        });
        this.clearSelectedProducts();
      })
      .catch(error => {
        this.loading = false;
        console.error('Error adding foods:', error);
        this.utilsService.presentToast({
          message: `Error al añadir los productos`,
          duration: 1500,
          color: 'primary',
          icon: 'person-outline',
          mode: 'ios'
        })
      });
  }

  getAllFoods() {
    this.loading = true;

    this.firebaseService.getAllFoods().subscribe(foods => {
      this.foods = foods;
      this.loading = false;
      console.log('Alimentos recibidos:', foods);
    });
  }
}