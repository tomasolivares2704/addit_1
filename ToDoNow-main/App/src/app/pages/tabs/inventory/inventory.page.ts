import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { myfood } from 'src/app/models/myfood.models';
import { User } from 'src/app/models/user.models';
import { Foods } from 'src/app/models/food.models';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {

  myfoods: myfood[] = [];
  filteredFoods: myfood[] = [];
  loading: boolean = false;
  user = {} as User;
  newFoodForm: FormGroup;
  addMode: boolean = true;
  searchTerm: string = '';
  food: myfood; // Declaración de la propiedad food
  

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private formBuilder: FormBuilder
  ) { 
    this.newFoodForm = this.formBuilder.group({
      name: ['', Validators.required],
      imagen: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getUser();
    this.getMyFoods();
    this.observeFoodChangesAndUpdateMyFoods();
  }

  getUser() {
    this.user = this.utilsSvc.getElementInLocalStorage('user');
  }

  getMyFoods() {
    let user: User = this.utilsSvc.getElementInLocalStorage('user');
    let path = `user/${user.uid}`;
    this.loading = true;
  
    this.firebaseSvc.getSubcollection(path, 'myfoods').subscribe({
      next: (myfoods: myfood[]) => {
        this.myfoods = myfoods.map(food => ({
          ...food,
          stock: food.stock !== undefined ? food.stock : (food.stock !== undefined ? food.stock : 1),
          stock_ideal: food.stock_ideal !== undefined ? food.stock_ideal : (food.stock_ideal !== undefined ? food.stock_ideal : 1)
        }));
        this.filteredFoods = this.myfoods;
        this.loading = false;
        this.applyStockColors();
      }
    });
  }
  
  

  observeFoodChangesAndUpdateMyFoods() {
    let user: User = this.utilsSvc.getElementInLocalStorage('user');
    this.firebaseSvc.observeFoodChangesAndUpdateMyFoods(user);
  }

  

  toggleMode(event: any) {
    this.addMode = event.detail.checked;
  }

  applyStockColors() {
    if (!this.myfoods || this.myfoods.length === 0) return;
    
    for (const food of this.myfoods) {
      const diferencia = food.stock - food.stock_ideal;
      if (diferencia >= 0) {
        food.bgColor = 'green'; // Stock igual al stock ideal o mayor
      } else if (diferencia !== 0 && food.stock_ideal > diferencia  ) {
        food.bgColor = 'yellow'; // Diferencia negativa pero no igual a cero
      } else {
        food.bgColor = 'red'; // Stock igual a cero
      }
    }
  }
  
  showStockEditor(food: myfood) {
    food.showStockEditor = true;
  }

  incrementStock(food: myfood) {
    food.stock++;
    food.stockToShow = food.stock;
  }

  decrementStock(food: myfood) {
    if (food.stock > 0) {
      food.stock--;
      food.stockToShow = food.stock;
    }
  }

  confirmStockChange(food: myfood) {
    food.stock = food.stockToShow;
    this.updateStock(food);
  }

  updateStock(food: myfood) {
    let user: User = this.utilsSvc.getElementInLocalStorage('user');
    let path = `user/${user.uid}/myfoods/${food.id}`;
    this.loading = true;
  
    // Crear un objeto solo con las propiedades que no son undefined
    const updateObject: Partial<myfood> = {};
  
    if (food.stock !== undefined) {
      updateObject.stock = food.stock;
    }
  
    // Aquí puedes agregar más propiedades que deseas actualizar
  
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
  

  cancelStockEdit(food: myfood) {
    food.stockToShow = food.stock;
    food.showStockEditor = false;
  }

   // Nueva función para filtrar alimentos
   filterFoods(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredFoods = this.myfoods.filter(food => {
      return food.name.toLowerCase().includes(searchTerm);
    });
  }

  // Nueva función para abrir el modal de filtros (puedes agregar más funcionalidad aquí)
  openFilterModal() {
    console.log('Abriendo modal de filtros');
    // Aquí puedes agregar la lógica para abrir un modal de filtros si es necesario
  }

  updateIdealStock(food: myfood) {
    let user: User = this.utilsSvc.getElementInLocalStorage('user');
    let path = `user/${user.uid}/myfoods/${food.id}`;
    this.loading = true;
  
    // Crear un objeto solo con las propiedades que no son undefined
    const updateObject: Partial<myfood> = {};
  
    if (food.stock_ideal !== undefined) {
      updateObject.stock_ideal = food.stock_ideal;
    }
  
    // Puedes agregar más propiedades que deseas actualizar aquí
  
    this.firebaseSvc.updateDocument(path, updateObject)
      .then(() => {
        console.log('Stock ideal actualizado exitosamente');
        this.loading = false;
      })
      .catch(error => {
        console.error('Error al actualizar stock ideal:', error);
        this.loading = false;
      });
  }

  showIdealStockEditor(food: myfood) {
    food.showStockEditor = true;
  }
  
  submitIdealStock(food: myfood) {
    let user: User = this.utilsSvc.getElementInLocalStorage('user');
    let path = `user/${user.uid}/myfoods/${food.id}`;
    this.loading = true;
    this.firebaseSvc.updateDocument(path, { stock_ideal: food.stock_ideal })
      .then(() => {
        console.log('Stock ideal actualizado exitosamente');
        this.loading = false;
        food.showStockEditor = false; // Oculta el editor de stock ideal después de actualizar
      })
      .catch(error => {
        console.error('Error al actualizar stock ideal:', error);
        this.loading = false;
      });
  }

  cancelIdealStockEdit(food: myfood) {
    food.showIdealStockEditor = false;
  }
  
  
  



  





}
