import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Foods, CategoriaAlimento } from 'src/app/models/food.models';
import { User } from 'src/app/models/user.models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
})
export class InventarioPage implements OnInit {

  user = {} as User;
  foods: Foods[] = [];
  loading: boolean = false;
  newFoodForm: FormGroup;
  selectedFood: Foods;

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private formBuilder: FormBuilder, // Inyectar FormBuilder en el constructor
    private route: ActivatedRoute,
    private router: Router // Inyectar Router en el constructor
  ) { 

  
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


  // Método para redirigir a la vista de detalles del alimento
  viewFoodDetails(foodId: string) {
    this.router.navigate(['/tabs/tabnutri', foodId]);
  }
  

}
