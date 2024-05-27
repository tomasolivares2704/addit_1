import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
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
  ) {}

  ngOnInit() {
    this.getAllFoods()
  }

  toggleProductSelection(foodId: string) {
    if (this.selectedProducts.has(foodId)) {
      this.selectedProducts.delete(foodId);
    } else {
      this.selectedProducts.add(foodId);
    }
  }

  addSelectedProducts() {
    const listId = this.route.snapshot.paramMap.get('id');
    const selectedFoods = this.foods.filter(food => this.selectedProducts.has(food.id));

    this.firebaseService.addProductsToList(listId, selectedFoods).then(() => {
      this.router.navigate([`/tabs/detalle-lista/${listId}`]);
    }).catch(error => {
      console.error('Error adding products to list:', error);
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