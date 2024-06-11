import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { NewList } from 'src/app/models/newlist.models';
import { NavController } from '@ionic/angular';
import { User } from 'src/app/models/user.models';

import { Foods } from 'src/app/models/food.models';
import { AlimentoListaCompra } from 'src/app/models/newlist.models';

@Component({
  selector: 'app-newlist',
  templateUrl: './newlist.page.html',
  styleUrls: ['./newlist.page.scss'],
})
export class NewlistPage implements OnInit {

  nombreLista: string;
  user = {} as User;
  listasDeUsuario: NewList[] = [];
  newlist: NewList = { id: '', nombre: '', total: 0, alimentos: [] }; // Inicializar newlist

  constructor(
    private firebaseService: FirebaseService,
    private navCtrl: NavController,
    private utilsSvc: UtilsService,
  ) { }

  ngOnInit() {
    this.getUser();
    this.obtenerListasDeUsuario();
    this.actualizarPrecioTotal();
  }

  getUser() {
    this.user = this.utilsSvc.getElementInLocalStorage('user');
    if (this.user && this.user.isAdmin) {
      this.utilsSvc.setElementInLocalStorage('isAdmin', true);
    }
  }

  crearNuevaLista() {
    if (this.nombreLista && this.user.uid) {
      // Obtener todos los alimentos
      this.firebaseService.getAllFoods().subscribe(
        (foods: Foods[]) => {
          // Crear una nueva lista con los alimentos obtenidos
          const nuevaLista: NewList = {
            id: '', 
            nombre: this.nombreLista,
            alimentos: [], 
            total: 0,
          };
  
          foods.forEach((food, index) => {
            // Usar un ID único generado automáticamente por Firebase si food.id no está definido
            const alimento: AlimentoListaCompra = {
              id: food.id || `food_${index}`, // Usar un ID predeterminado si food.id no está disponible
              nombre: food.name,
              cantidad: 0,
              precio: food.price,
              subtotal: 0,
            };
            nuevaLista.alimentos.push(alimento);
          });
  
          // Crear la nueva lista en Firebase
          this.firebaseService.crearNewList(this.user.uid, nuevaLista)
            .then((newListId) => {
              nuevaLista.id = newListId; // Actualizar el ID con el ID asignado por Firestore
              console.log('Nueva lista creada exitosamente:', nuevaLista);
            })
            .catch(error => {
              console.error('Error al crear nueva lista:', error);
            });
        },
        (error) => {
          console.error('Error al obtener alimentos:', error);
        }
      );
    } else {
      console.error('El nombre de la lista es obligatorio.');
    }
  }
  
  
  
  

  obtenerListasDeUsuario() {
    if (this.user && this.user.uid) {
      this.firebaseService.obtenerNewListDeUsuario(this.user.uid)
        .subscribe(listas => {
          if (listas) {
            this.listasDeUsuario = listas;
            console.log('Listas del usuario:', listas);
      
            // Imprimir el ID y el nombre de la lista, y el precio de cada alimento en la consola
            listas.forEach(lista => {
              console.log('ID de la lista:', lista.id);
              console.log('Nombre de la lista:', lista.nombre);
              if (lista.alimentos) {
                lista.alimentos.forEach(alimento => {
                  console.log('Nombre del alimento:', alimento.nombre, 'Precio:', alimento.precio);
                });
              } else {
                console.log('La lista no tiene alimentos.');
              }
            });
          } else {
            console.error('La respuesta del servicio es undefined.');
          }
        }, error => {
          console.error('Error al obtener listas del usuario:', error);
        });
    } else {
      console.error('UID del usuario no disponible.');
    }
  }
  
  
  

  verDetallesLista(id: string) {
    this.navCtrl.navigateForward(['/tabs/detnewlist', id]);
  }

  // Función para actualizar el precio total basado en los precios de los alimentos en la lista
  actualizarPrecioTotal() {
    this.newlist.total = 0; // Reiniciar el total de la lista
    
    // Sumar el precio de cada alimento en la lista
    this.newlist.alimentos.forEach(alimento => {
      this.newlist.total += alimento.precio;
    });
  }
}
