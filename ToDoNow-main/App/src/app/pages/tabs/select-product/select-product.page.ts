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
  selectedProducts: Set<string> = new Set();
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
    if (this.selectedProducts.has(foodId)) {
      this.selectedProducts.delete(foodId);
    } else {
      this.selectedProducts.add(foodId);
    }
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
    //const selectedFoods = this.foods.filter(food => this.selectedProducts.has(food.id));
    const selectedFoods = this.utilsService.getElementInLocalStorage('myfoods');
    

    this.firebaseService.addProductsToList(userId, listId, selectedFoods)
      .then(() => {
        console.log('Foods added successfully');
      })
      .catch(error => {
        console.error('Error adding foods:', error);
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