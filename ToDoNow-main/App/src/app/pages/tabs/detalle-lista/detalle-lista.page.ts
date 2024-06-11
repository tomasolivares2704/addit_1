import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

// Servicios
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

//Modelos
import { User } from 'src/app/models/user.models';
import { List, Product } from 'src/app/models/list.models';
import { Foods } from 'src/app/models/food.models';

@Component({
  selector: 'app-detalle-lista',
  templateUrl: './detalle-lista.page.html',
  styleUrls: ['./detalle-lista.page.scss'],
})
export class DetalleListaPage implements OnInit {

  user = {} as User;
  selectedList: List;
  foods: Foods[] = [];
  product: Product[] = [];
  deleteMode: boolean = false;

  constructor(
    private utilsService: UtilsService,
    private firebaseService: FirebaseService,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  getUser() {
    return this.user = this.utilsService.getElementInLocalStorage('user');
  }

  ngOnInit() {
    this.getUser(); 

    const listId = this.route.snapshot.paramMap.get('id');
    if (listId) {
      // Obtener la lista actual y asignarla a selectedList
      this.firebaseService.getListById(listId).subscribe((list: List) => {
        this.selectedList = list;
        // Obtener los productos de la lista actual
        this.getProductsByListId(listId);
      });
    } else {
      console.error('No list ID found in route');
    }
  }

  getProductsByListId(listId: string) {
    this.firebaseService.getListById(listId).subscribe((list: List) => {
      this.selectedList = list;
      this.product = list.product; // Asignamos los alimentos de la lista a la variable foods
    });
  }

  async deleteList(productId: string) {
    const listId = this.route.snapshot.paramMap.get('id');
    const path = `user/${this.user.uid}/list/${listId}`;
  
    try {
      await this.firebaseService.deleteDocument(path + `/foods/${productId}`);
      this.getProductsByListId(listId); // Actualizamos la lista después de eliminar el producto
      this.toggleDeleteMode(); // Salimos del modo de eliminación después de eliminar el producto
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  }

  addProductToList() {
    const listId = this.route.snapshot.paramMap.get('id');
    this.router.navigate([`/tabs/detalle-lista/${listId}/select-products`]);
  }

  toggleDeleteMode() {
    // Implementar la lógica para cambiar el modo de eliminación
    console.log('Modo de eliminación activado/desactivado');
  }

  
}
