import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Foods } from 'src/app/models/food.models';


@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.page.html',
  styleUrls: ['./inventario.page.scss'],
})
export class InventarioPage implements OnInit {

  foods: Foods[] = [];
  loading: boolean = false;

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService) { }

  ngOnInit() {
    this.getAllFoods();
  }

  getAllFoods() {
    this.loading = true;

    this.firebaseSvc.getAllFoods().subscribe(foods => {
      this.foods = foods;
      this.loading = false;
      console.log('Alimentos recibidos:', foods);
    });
  }

}

