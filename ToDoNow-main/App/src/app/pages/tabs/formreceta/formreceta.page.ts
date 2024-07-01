import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Receta } from 'src/app/models/receta.models';
import { myfood } from 'src/app/models/myfood.models';
import { User } from 'src/app/models/user.models';
import { Foods } from 'src/app/models/food.models';

@Component({
  selector: 'app-formreceta',
  templateUrl: './formreceta.page.html',
  styleUrls: ['./formreceta.page.scss'],
})
export class FormrecetaPage implements OnInit {

  newRecetaForm: FormGroup;
  loading: boolean = false;
  recetas: Receta[] = [];
  myfoods: myfood[] = [];
  user: User;
  foods: Foods[] = [];


  constructor(
    private formBuilder: FormBuilder,
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) { 

    this.newRecetaForm = this.formBuilder.group({
      name: ['', Validators.required],
      imagen: ['', Validators.required],
      calories: ['', Validators.required],
      protein: ['', Validators.required],
      fats: ['', Validators.required],
      carbohydrates: ['', Validators.required],
      ingredients: this.formBuilder.array([])
    });

  }

  ngOnInit() {
    this.getUser();
    this.getRecetas();
    this.addIngredient(); // Inicialmente añade un ingrediente vacío
    this.getAllFoods();
  }

  get ingredients(): FormArray {
    return this.newRecetaForm.get('ingredients') as FormArray;
  }

  addIngredient() {
    const ingredientForm = this.formBuilder.group({
      name: ['', Validators.required],
      stock: ['', Validators.required]
    });
    this.ingredients.push(ingredientForm);
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  addNewReceta() {
    if (this.newRecetaForm.invalid) {
      return;
    }

    const newRecetaData = this.newRecetaForm.value as Receta;
    this.loading = true;

    this.firebaseSvc.addReceta(newRecetaData).then(() => {
      this.newRecetaForm.reset();
      this.ingredients.clear(); // Clear ingredients array after form reset
      this.addIngredient(); // Add an initial empty ingredient form group
      this.loading = false;
      this.getRecetas(); // Refresh the list of recipes
    }).catch(error => {
      this.loading = false;
      console.error('Error al agregar receta:', error);
    });
  }

  getRecetas() {
    this.loading = true;

    this.firebaseSvc.getRecetas().subscribe(recetas => {
      this.recetas = recetas;
      this.loading = false;
      console.log('Recetas recibidas:', recetas);
    }, error => {
      console.error('Error al obtener recetas:', error);
      this.loading = false;
    });
  }


  getAllFoods() {
    this.loading = true;
    this.firebaseSvc.getAllFoods().subscribe(foods => {
      this.foods = foods;
      this.loading = false;
    });
  }

  /*
  getMyFoods() {
    this.loading = true;
  
    const user: User = this.utilsSvc.getElementInLocalStorage('user');
    const path = `user/${user.uid}`;
  
    this.firebaseSvc.getSubcollection(path, 'myfoods').subscribe({
      next: (myfoods: myfood[]) => {
        this.myfoods = myfoods.map(food => {
          console.log('Mapping food from DB:', food); // Debug log
          return {
            ...food,
            stock: food.stock !== undefined ? food.stock : 1,
            stock_ideal: food.stock_ideal !== undefined ? food.stock_ideal : 1
          };
        });
        console.log('myfoods after DB fetch:', this.myfoods); // Debug log
        this.loading = false;
        // Guardar en localStorage después de obtener de la base de datos
        this.utilsSvc.setElementInLocalStorage('myfoods', this.myfoods);
      },
      error: (error) => {
        console.error('Error al obtener alimentos:', error);
        this.loading = false;
      }
    });
  }

  */
  
  
  canDiscountIngredients(receta: Receta): boolean {
    for (const ingredient of receta.ingredients) {
      const matchingFood = this.myfoods.find(food => food.name === ingredient.name);
      if (!matchingFood || matchingFood.stock < ingredient.stock) {
        return false; // No hay suficiente stock para al menos un ingrediente
      }
    }
    return true; // Hay suficiente stock para todos los ingredientes
  }
  
  discountIngredients(receta: Receta) {
    this.loading = true;
  
    for (const ingredient of receta.ingredients) {
      const matchingFoodIndex = this.myfoods.findIndex(food => food.name === ingredient.name);
      if (matchingFoodIndex !== -1 && this.myfoods[matchingFoodIndex].stock >= ingredient.stock) {
        console.log(`Descontando ${ingredient.stock} de ${ingredient.name} de ${this.myfoods[matchingFoodIndex].stock}`);
        this.myfoods[matchingFoodIndex].stock -= ingredient.stock;
        this.updateFoodStock(this.myfoods[matchingFoodIndex]);
      } else {
        console.log(`No hay suficiente stock para descontar ${ingredient.stock} de ${ingredient.name}`);
        this.utilsSvc.presentToast({ message: `Stock insuficiente para ${ingredient.name}` });
        this.loading = false;
        return; // Detener el proceso si no hay suficiente stock para un ingrediente
      }
    }
  
    // Actualizar los datos en el localStorage después de descontar los ingredientes
    this.utilsSvc.setElementInLocalStorage('myfoods', this.myfoods);
    console.log('myfoods después de descontar ingredientes:', this.myfoods);
  
    // Mostrar el mensaje de éxito y luego desaparecer automáticamente después de 1 segundo
    this.utilsSvc.presentToast({ message: 'Ingredientes descontados correctamente.' });
    setTimeout(() => {
      this.utilsSvc.dismissToast();
    }, 2500);
  
    this.loading = false;
  }
  
  
  

  updateFoodStock(food: myfood) {
    const user: User = this.utilsSvc.getElementInLocalStorage('user');
    const path = `user/${user.uid}/myfoods/${food.id}`;

    this.firebaseSvc.updateDocument(path, { stock: food.stock })
      .then(() => {
        console.log(`Stock de ${food.name} actualizado exitosamente`);
      })
      .catch(error => {
        console.error(`Error al actualizar stock de ${food.name}:`, error);
      });
  }

  getUser() {
    this.user = this.utilsSvc.getElementInLocalStorage('user');
  }

  ingredientInMyFoods(name: string): boolean {
    return this.myfoods.some(food => food.name === name);
  }
  
  getMyFoodStock(name: string): number {
    const food = this.myfoods.find(food => food.name === name);
    return food ? food.stock : 0;
  }

}
