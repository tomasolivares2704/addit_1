import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ActivatedRoute } from '@angular/router';
import { AlimentoListaCompra, NewList } from 'src/app/models/newlist.models';
import { UtilsService } from 'src/app/services/utils.service';
import { Foods } from 'src/app/models/food.models';

@Component({
  selector: 'app-detnewlist',
  templateUrl: './detnewlist.page.html',
  styleUrls: ['./detnewlist.page.scss'],
})
export class DetnewlistPage implements OnInit {
  newlist: NewList = { id: '', nombre: '', alimentos: [] }; // Inicialización de newlist
  userUid: string;
  foods: Foods[] = [];
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) { }

  ngOnInit() {
    this.getUser();
    this.getAllFoods();
  }

  getUser() {
    const user = this.utilsSvc.getElementInLocalStorage('user');
    if (user && user.uid) {
      this.userUid = user.uid;
      this.loadNewListDetails();
    } else {
      console.error('No se pudo obtener el UID del usuario');
    }
  }

  loadNewListDetails() {
    const listId = this.route.snapshot.paramMap.get('id');
    if (listId) {
      this.newlist.id = listId; // Asignar el ID de la lista obtenido de la URL
      this.firebaseSvc.obtenerDetallesLista(this.userUid, listId).subscribe(
        (list) => {
          this.newlist = list;
        },
        (error) => {
          console.error('Error al obtener los detalles de la lista:', error);
        }
      );
    } else {
      console.error('No se encontró el ID de la lista en la ruta');
    }
  }

  getAllFoods() {
    this.loading = true;
    this.firebaseSvc.getAllFoods().subscribe(
      (foods: Foods[]) => {
        this.foods = foods;
        this.loading = false;
        console.log('Alimentos recibidos:', foods);
        // Inicializar newlist utilizando los alimentos recibidos
        this.initNewListFromFoods(this.newlist.id);
      },
      (error) => {
        console.error('Error al obtener alimentos:', error);
        this.loading = false;
      }
    );
  }

  initNewListFromFoods(listId: string) {
    // Limpiar la lista de alimentos de newlist
    this.newlist.alimentos = [];
    // Iterar sobre los alimentos y agregarlos a la lista de alimentos de newlist
    this.foods.forEach(food => {
      const alimento: AlimentoListaCompra = {
        id: food.id,
        listaId: listId, // Asignar el ID de la lista
        nombre: food.name,
        cantidad: 0, // Inicializar cantidad en 0
        subtotal: 0, // Inicializar subtotal en 0
      };
      this.newlist.alimentos.push(alimento);
    });
  }

  agregarAlimento(alimento: AlimentoListaCompra) {
    // Agregar el alimento a la lista de alimentos de la nueva lista de compra
    this.firebaseSvc.agregarAlimentoALista(this.userUid, this.newlist.id, alimento)
      .then(() => {
        console.log('Alimento agregado exitosamente a la lista.');
      })
      .catch(error => {
        console.error('Error al agregar el alimento a la lista:', error);
      });
  }
}
