import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Foods, CategoriaAlimento } from 'src/app/models/food.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

import { User } from 'src/app/models/user.models';

@Component({
  selector: 'app-formfood',
  templateUrl: './formfood.page.html',
  styleUrls: ['./formfood.page.scss'],
})
export class FormfoodPage implements OnInit {

  user = {} as User;
  foods: Foods[] = [];
  loading: boolean = false;
  newFoodForm: FormGroup; // Definir la variable para el formulario
  selectedFood: Foods;
  categorias: string[]; // Array de categorías disponibles

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private router: Router
  ) {
    // Inicializa las categorías disponibles
    this.categorias = Object.values(CategoriaAlimento); // Obtén los valores del enum como array

    // Formulario
    this.newFoodForm = this.formBuilder.group({
      name: ['', Validators.required],
      calories: ['', Validators.required],
      imagen: ['', Validators.required],
      fat: ['', Validators.required],
      fat_sat: ['', Validators.required],
      fat_trans: ['', Validators.required],
      sodio: ['', Validators.required],
      carbs: ['', Validators.required],
      protein: ['', Validators.required],
      colesterol: ['', Validators.required],
      fibra: ['', Validators.required],
      medida: ['', Validators.required],
      price: ['', Validators.required],
      price2: ['', Validators.required],
      categoria: [CategoriaAlimento.Verduras, Validators.required] // Valor por defecto y validación
    });
  }

  ngOnInit() {
    this.getUser(); // Obtener datos del usuario al cargar la vista
    this.getAllFoods();
  }

  getUser() {
    // Obtener los datos del usuario del almacenamiento local
    this.user = this.utilsSvc.getElementInLocalStorage('user');

    // Verificar si el usuario tiene el rol de administrador
    if (this.user && this.user.isAdmin) {
      // Si el usuario es administrador, establecer isAdmin en true en el almacenamiento local
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

  addNewFood() {
    if (this.newFoodForm.valid) {
      const newFoodData: Foods = {
        ...this.newFoodForm.value,
        id: ''
      };
      this.loading = true;

      this.firebaseSvc.addFoodToCollections(newFoodData).then(() => {
        this.newFoodForm.reset();
        this.loading = false;
      }).catch(error => {
        this.loading = false;
        console.error('Error al agregar alimento:', error);
      });
    } else {
      console.error('Formulario no válido');
    }
  }

  // Método para redirigir a la vista de detalles del alimento
  viewFoodDetails(foodId: string) {
    this.router.navigate(['/tabs/tabnutri', foodId]);
  }

}
