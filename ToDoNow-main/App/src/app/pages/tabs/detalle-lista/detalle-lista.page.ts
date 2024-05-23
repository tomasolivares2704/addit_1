import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

// Servicios
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

//Modelos
import { User } from 'src/app/models/user.models';
import { List, Product } from 'src/app/models/list.models';

@Component({
  selector: 'app-detalle-lista',
  templateUrl: './detalle-lista.page.html',
  styleUrls: ['./detalle-lista.page.scss'],
})
export class DetalleListaPage implements OnInit {

  user = {} as User;
  selectedList: List;
  products: Product[] = [];
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

  getProductsByListId(productId: string) {
    const user: User = this.utilsService.getElementInLocalStorage('user');
    
    const listId = this.route.snapshot.paramMap.get('id');
    const path = `user/${user.uid}/list/${listId}/products/${productId}`;

    this.firebaseService.getSubcollection(path, 'product').subscribe((res: Product[]) => {
      this.products = res;
      console.log(this.products);
    });
  }

  async deleteList(productId: string) {
    const listId = this.route.snapshot.paramMap.get('id');
    const path = `user/${this.user.uid}/list/${listId}/product/${productId}`;
    
    try {
      await this.firebaseService.deleteDocument(path);
      this.getProductsByListId(listId); // Refresh the list after deletion
      this.toggleDeleteMode(); // Exit delete mode after deletion
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
    }
  }

  addProductToList() {
    this.router.navigate(['tabs/inventario', this.route.snapshot.paramMap.get('id')]);
  }

  toggleDeleteMode() {
    // Implementar la lógica para cambiar el modo de eliminación
    console.log('Modo de eliminación activado/desactivado');
  }

  
}
