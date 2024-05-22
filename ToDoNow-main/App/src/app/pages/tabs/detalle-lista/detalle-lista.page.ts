import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';{}

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
  lists: List[] = [];
  selectedList: List;
  products: Product[] = [];

  constructor(
    private utilsService: UtilsService,
    private firebaseService: FirebaseService,
    private route: ActivatedRoute,
  ) {}

  getUser() {
    return this.user = this.utilsService.getElementInLocalStorage('user');
  }
  ngOnInit() {
    this.getUser(); 

    const listId = this.route.snapshot.paramMap.get('id');
    if (listId) {
      this.getProductsByListId(listId);
    } else {
      console.error('No food ID found in route');
    }
  }

  getProductsByListId(productId: string) {
    const user: User = this.utilsService.getElementInLocalStorage('user');
    const listId = this.route.snapshot.paramMap.get('id');
    const path = `user/${user.uid}/list/${listId}/product/${productId}`;

    this.firebaseService.getSubcollection(path, 'product').subscribe((res: Product[]) => {
      console.log(res);
      this.products = res;
      console.log(this.products);
    });
  }

/*
  addProductToList() {

  }
  */
}
