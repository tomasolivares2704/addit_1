import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { myfood } from 'src/app/models/myfood.models';
import { User } from 'src/app/models/user.models';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {

  myfoods: myfood[] = [];           // Lista de alimentos del usuario
  filteredFoods: myfood[] = [];     // Alimentos filtrados por término de búsqueda
  loading: boolean = false;         // Indicador de carga
  user = {} as User;                // Usuario actual
  newFoodForm: FormGroup;           // Formulario Reactivo para agregar nuevos alimentos
  addMode: boolean = true;          // Modo de agregar o editar alimentos
  searchTerm: string = '';          // Término de búsqueda para filtrar alimentos
  stockIdealToShow: number;         // Valor del stock ideal a mostrar en el formulario

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private formBuilder: FormBuilder
  ) {
    // Inicialización del formulario reactivo para agregar nuevos alimentos
    this.newFoodForm = this.formBuilder.group({
      name: ['', Validators.required],
      imagen: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getUser();                         // Obtiene el usuario actual
    this.getMyFoods();                      // Obtiene los alimentos del usuario
    this.observeFoodChangesAndUpdateMyFoods();  // Observa cambios en los alimentos
  }

  // Función para obtener el usuario desde el almacenamiento local
  getUser() {
    this.user = this.utilsSvc.getElementInLocalStorage('user');
    console.log('ID DEL USUARIO:', this.user.uid);
  }

  // Función para obtener los alimentos del usuario
  getMyFoods() {
    let user: User = this.utilsSvc.getElementInLocalStorage('user');
    let path = `user/${user.uid}`;
    this.loading = true;

    this.firebaseSvc.getSubcollection(path, 'myfoods').subscribe({
      next: (myfoods: myfood[]) => {
        // Asigna y procesa los alimentos obtenidos
        this.myfoods = myfoods.map(food => ({
          ...food,
          stock: food.stock !== undefined ? food.stock : 1,
          stock_ideal: food.stock_ideal !== undefined ? food.stock_ideal : 1,
          showStockEditor: false, // Propiedad para mostrar el editor de stock
          showIdealStockEditor: false // Propiedad para mostrar el editor de stock ideal
        }));
        this.filteredFoods = this.myfoods;   // Inicialmente muestra todos los alimentos
        this.loading = false;                // Finaliza la carga
        this.applyStockColors();             // Aplica los colores según el stock
        this.utilsSvc.setElementInLocalStorage('myfoods', this.myfoods);  // Guarda en localStorage
      },
      error: (error) => {
        console.error('Error al obtener alimentos:', error);
        this.loading = false;                // Finaliza la carga en caso de error
      }
    });
  }

  // Función para observar cambios en los alimentos y actualizar
  observeFoodChangesAndUpdateMyFoods() {
    let user: User = this.utilsSvc.getElementInLocalStorage('user');
    this.firebaseSvc.observeFoodChangesAndUpdateMyFoods(user);
  }

  // Función para cambiar entre modo de agregar y editar alimentos
  toggleMode(event: any) {
    this.addMode = event.detail.checked;
  }

  // Función para aplicar colores según el nivel de stock
  applyStockColors() {
    if (!this.myfoods || this.myfoods.length === 0) return;

    for (const food of this.myfoods) {
      const porcentajeStock = (food.stock / food.stock_ideal) * 100;

      if (porcentajeStock >= 100) {
        food.bgColor = 'green';   // Stock igual o mayor al 100% del ideal
      } else if (porcentajeStock >= 50) {
        food.bgColor = 'yellow';  // Stock entre el 50% y 99% del ideal
      } else if (porcentajeStock >= 20) {
        food.bgColor = 'orange';  // Stock entre el 20% y 49% del ideal
      } else {
        food.bgColor = 'red';     // Stock menor al 20% del ideal
      }
    }
  }

  // Función para mostrar el editor de stock de un alimento
  showStockEditor(food: myfood) {
    food.showStockEditor = true;
  }

  // Función para incrementar el stock de un alimento
  incrementStock(food: myfood) {
    food.stock++;
    food.stockToShow = food.stock;
  }

  // Función para decrementar el stock de un alimento
  decrementStock(food: myfood) {
    if (food.stock > 0) {
      food.stock--;
      food.stockToShow = food.stock;
    }
  }

  // Función para confirmar el cambio de stock de un alimento
  confirmStockChange(food: myfood) {
    food.stock = food.stockToShow;
    this.updateStock(food);   // Llama a la función para actualizar en Firebase
  }

  // Función para actualizar el stock de un alimento en Firebase
  updateStock(food: myfood) {
    let user: User = this.utilsSvc.getElementInLocalStorage('user');
    let path = `user/${user.uid}/myfoods/${food.id}`;
    this.loading = true;

    const updateObject: Partial<myfood> = {};
    if (food.stock !== undefined) {
      updateObject.stock = food.stock;
    }

    this.firebaseSvc.updateDocument(path, updateObject)
      .then(() => {
        console.log('Cantidad de stock actualizada exitosamente');
        this.loading = false;
      })
      .catch(error => {
        console.error('Error al actualizar cantidad de stock:', error);
        this.loading = false;
      });
  }

  // Función para cancelar la edición del stock de un alimento
  cancelStockEdit(food: myfood) {
    food.stockToShow = food.stock;
    food.showStockEditor = false;
  }

  // Función para filtrar alimentos según un término de búsqueda
  filterFoods(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredFoods = this.myfoods.filter(food => {
      return food.name.toLowerCase().includes(searchTerm);
    });
  }

  // Función para abrir un modal de filtros (puedes agregar funcionalidad adicional aquí)
  openFilterModal() {
    console.log('Abriendo modal de filtros');
    // Lógica para abrir un modal de filtros si es necesario
  }

  // Función para mostrar el editor de stock ideal de un alimento
  showIdealStockEditor(food: myfood) {
    food.showIdealStockEditor = true;
    this.stockIdealToShow = food.stock_ideal;
  }

  // Función para confirmar el cambio de stock ideal de un alimento
  submitIdealStock(food: myfood) {
    let user: User = this.utilsSvc.getElementInLocalStorage('user');
    let path = `user/${user.uid}/myfoods/${food.id}`;
    this.loading = true;
    this.firebaseSvc.updateDocument(path, { stock_ideal: food.stock_ideal })
      .then(() => {
        console.log('Stock ideal actualizado exitosamente');
        this.loading = false;
        food.showIdealStockEditor = false; // Oculta el editor de stock ideal después de actualizar
      })
      .catch(error => {
        console.error('Error al actualizar stock ideal:', error);
        this.loading = false;
      });
  }

  // Función para cancelar la edición del stock ideal de un alimento
  cancelIdealStockEdit(food: myfood) {
    food.showIdealStockEditor = false;
  }

  // Función para incrementar el stock ideal de un alimento
  incrementStockIdeal(food: myfood) {
    food.stock_ideal++;
  }

  // Función para decrementar el stock ideal de un alimento
  decrementStockIdeal(food: myfood) {
    if (food.stock_ideal > 0) {
      food.stock_ideal--;
    }
  }
}
