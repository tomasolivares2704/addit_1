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

  myfoods: myfood[] = [];
  filteredFoods: myfood[] = [];
  loading: boolean = false;
  user = {} as User;
  newFoodForm: FormGroup;
  addMode: boolean = true;
  searchTerm: string = '';

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
    this.user = this.utilsSvc.getElementInLocalStorage('user');
  }

  getMyFoods() {
    let user: User = this.utilsSvc.getElementInLocalStorage('user');
    let path = `user/${user.uid}`;
    this.loading = true;
  
    this.firebaseSvc.getSubcollection(path, 'myfoods').subscribe({
      next: (myfoods: myfood[]) => {
        this.myfoods = myfoods;
        this.filteredFoods = myfoods;
        this.loading = false;
        this.applyStockColors();
      }
    });
  }

  addNewFood() {
    if (this.newFoodForm.valid) {
      const newFoodData = this.newFoodForm.value;
      let user: User = this.utilsSvc.getElementInLocalStorage('user');
      let path = `user/${user.uid}`;
      this.loading = true;
  
      this.firebaseSvc.addToSubcollection(path, 'myfoods', newFoodData).then(() => {
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

  toggleMode(event: any) {
    this.addMode = event.detail.checked;
  }

  applyStockColors() {
    if (!this.myfoods || this.myfoods.length === 0) return;
  
    for (const food of this.myfoods) {
      const diferencia = food.stock - food.stock_ideal;
      if (diferencia < 0) {
        food.bgColor = 'yellow';
      } else if (diferencia === 0) {
        food.bgColor = 'red';
      } else {
        food.bgColor = 'green';
      }
    }
  }

  filterFoods() {
    this.filteredFoods = this.myfoods.filter(food => 
      food.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
  }
}
