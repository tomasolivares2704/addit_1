import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { TogglerService } from 'src/app/services/toggler.service';
import { Foods,CategoriaAlimento } from 'src/app/models/food.models';
import { User } from 'src/app/models/user.models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { TabNutriModalComponent } from 'src/app/shared/components/tab-nutri-modal/tab-nutri-modal.component';


@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
})
export class InventarioPage implements OnInit {

  user = {} as User;
  foods: Foods[] = [];
  filtered: Foods[] = [];

  loading: boolean = false;
  newFoodForm: FormGroup;
  selectedFood: Foods;
  selectedCategoria: CategoriaAlimento; // Variable para almacenar la categoría seleccionada
  categorias: CategoriaAlimento[] = Object.values(CategoriaAlimento); // Array de categorías

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private formBuilder: FormBuilder, // Inyectar FormBuilder en el constructor
    private router: Router, // Inyectar Router en el constructor
    private modalController: ModalController,
    private togglerService: TogglerService,
  ) {}

  ngOnInit() {
    this.getUser(); // Obtener datos del usuario al cargar la vista
    this.getAllFoods();
    this.loadActiveProfile();
  }

  ionViewWillEnter() {
    this.getAllFoods(); // Asegura que los alimentos se carguen al entrar en la vista
    this.loadActiveProfile(); // Llama al método para cargar el perfil activo
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
      this.filterFoods();
      console.log('Alimentos permitidos:', foods);
    });
  }



  // Método para redirigir a la vista de detalles del alimento
  viewFoodDetails(foodId: string) {
    this.router.navigate(['/tabs/tabnutri', foodId]);
  }

  // Método para resetear el filtro y mostrar todos los alimentos
  resetFilter() {
    this.selectedCategoria = null;
    this.filterFoods();
  }

  // Propiedad calculada para almacenar los alimentos filtrados
  get filteredFoods(): Foods[] {
    if (!this.selectedCategoria) {
      return this.foods; // Devuelve todos los alimentos si no hay categoría seleccionada
    }
    return this.foods.filter(food => food.categoria === this.selectedCategoria);
  }

  async openFoodDetailsModal(foodId: string) {
    const modal = await this.modalController.create({
      component: TabNutriModalComponent,
      cssClass: 'custom-modal',
      backdropDismiss: true,
      componentProps: {
        foodId: foodId 
      }
    });
  
    return await modal.present();
  }

  filterFoods() {
    const activeProfile = this.togglerService.getActiveProfile();
    if (activeProfile) {
      this.filtered = this.foods.filter(food => {
        return (
          food.calories === activeProfile.calories &&
          food.protein === activeProfile.protein &&
          food.carbs === activeProfile.carbs
        );
      });
    } else {
      this.filtered = this.foods;
    }
  }
  
  private loadActiveProfile() {
    this.togglerService.loadActiveProfile();
  }

}

//
//
//
//