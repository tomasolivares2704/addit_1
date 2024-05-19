import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { myfood } from 'src/app/models/myfood.models';
import { User } from 'src/app/models/user.models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificacionesComponent } from 'src/app/shared/components/notificaciones/notificaciones.component';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {

  myfoods: myfood[] = [];
  loading: boolean = false;
  user = {} as User;
  newFoodForm: FormGroup;

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private formBuilder: FormBuilder
    
  ) { 
    this.newFoodForm = this.formBuilder.group({
      name: ['', Validators.required],
      imagen: ['', Validators.required],
      stock: ['', Validators.required],
      stock_ideal: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.getUser();
    this.getMyFoods();
  }

  getUser() {
    return this.user = this.utilsSvc.getElementInLocalStorage('user');
  }

  getMyFoods() {
    let user: User = this.utilsSvc.getElementInLocalStorage('user');
    let path = `user/${user.uid}`;
    this.loading = true;
  
    this.firebaseSvc.getSubcollection(path, 'myfoods').subscribe({
      next: (myfoods: myfood[]) => {
        console.log(myfoods);
        this.myfoods = myfoods;
        this.loading = false;
        this.applyStockColors();
      }
    });
  }

  addNewFood() {
    if (this.newFoodForm.valid) {
      const newFoodData = {
        name: this.newFoodForm.value.name,
        imagen: this.newFoodForm.value.imagen,
        stock: this.newFoodForm.value.stock,
        stock_ideal: this.newFoodForm.value.stock_ideal
      };
  
      let user: User = this.utilsSvc.getElementInLocalStorage('user');
      let path = `user/${user.uid}`;
      this.loading = true;
  
      this.firebaseSvc.addToSubcollection(path, 'myfoods', newFoodData).then(() => {
        console.log('Alimento agregado correctamente');
        // Limpiar el formulario después de agregar el alimento
        this.newFoodForm.reset();
        this.loading = false;
      }).catch(error => {
        console.error('Error al agregar alimento:', error);
        this.loading = false;
      });
    } else {
      console.error('Formulario no válido');
    }
  }

  

  applyStockColors() {
    if (!this.myfoods || this.myfoods.length === 0) return;
  
    for (const food of this.myfoods) {
      const diferencia = food.stock - food.stock_ideal;
   
  
      if (diferencia < 0) {
        food.bgColor = 'yellow'; // Color de fondo para stock bajo
      } else if (diferencia === 0) {
        food.bgColor = 'red'; // Color de fondo para stock agotado
      } else {
        food.bgColor = 'green'; // Color de fondo para stock alto
      }
      console.log('Food:', food.name, 'Color:', food.bgColor); // Agregar este console.log
    }
  }
  
  


}
