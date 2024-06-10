import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Receta, Ingredient } from 'src/app/models/receta.models';
import { myfood } from 'src/app/models/myfood.models';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-receta-detalle',
  templateUrl: './receta-detalle.page.html',
  styleUrls: ['./receta-detalle.page.scss'],
})
export class RecetaDetallePage implements OnInit {

  receta: Receta | undefined;
  user: any;


  constructor(
    private route: ActivatedRoute,
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) { }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.firebaseSvc.getReceta(id).subscribe(receta => {
        this.receta = receta;
      });
    }
    this.getUser();
  }

  getUser() {
    this.user = this.utilsSvc.getElementInLocalStorage('user');
  }

  descontarStock(ingredient: Ingredient) {
    if (this.user && this.user.uid) {
      const path = `user/${this.user.uid}/myfoods`;
      this.firebaseSvc.getSubcollection(path, 'myfoods').subscribe((foods: myfood[]) => {
        const food = foods.find(f => f.name === ingredient.name);
        if (food) {
          const updatedStock = food.stock - ingredient.stock;
          this.firebaseSvc.updateDocument(`${path}/${food.id}`, { stock: updatedStock }).then(() => {
            console.log(`Stock of ${food.name} updated to ${updatedStock}`);
          }).catch(error => {
            console.error('Error updating stock:', error);
          });
        }
      });
    }
  }

}
