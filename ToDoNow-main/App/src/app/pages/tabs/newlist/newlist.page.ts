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
  newlist: NewList = null; // Inicializar newlist como null o undefined al inicio

  constructor(
    private firebaseService: FirebaseService,
    private navCtrl: NavController,
    private utilsSvc: UtilsService,
  ) { }

  ngOnInit() {
    this.getUser();
    this.obtenerListasDeUsuario();
  }

  getUser() {
    this.user = this.utilsSvc.getElementInLocalStorage('user');
    if (this.user && this.user.isAdmin) {
      this.utilsSvc.setElementInLocalStorage('isAdmin', true);
    }
  }

  crearNuevaLista() {
    if (this.nombreLista && this.user.uid) {
      this.firebaseService.getAllFoods().subscribe(
        (foods: Foods[]) => {
          this.newlist = {
            id: '', 
            nombre: this.nombreLista,
            alimentos: [], 
            total: 0,
          };
  
          foods.forEach((food, index) => {
            const alimento: AlimentoListaCompra = {
              id: food.id || `food_${index}`,
              nombre: food.name,
              cantidad: 0,
              precio: food.price,
              subtotal: 0,
            };
            this.newlist.alimentos.push(alimento);
          });
  
          this.firebaseService.crearNewList(this.user.uid, this.newlist)
            .then((newListId) => {
              this.newlist.id = newListId;
              console.log('Nueva lista creada exitosamente:', this.newlist);
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
        .subscribe(
          (listas: NewList[]) => {
            if (listas.length > 0) {
              this.listasDeUsuario = listas;
              console.log('Listas del usuario:', listas);
  
              // Iterar sobre cada lista para cargar los alimentos desde la subcolección
              listas.forEach(lista => {
                console.log('ID de la lista:', lista.id);
                console.log('Nombre de la lista:', lista.nombre);
  
                // Obtener los detalles de los alimentos desde la subcolección
                this.firebaseService.obtenerDetallesAlimentos(this.user.uid, lista.id)
                  .subscribe(
                    (alimentos: AlimentoListaCompra[]) => {
                      if (alimentos.length > 0) {
                        lista.alimentos = alimentos; // Asignar los alimentos a la lista
                        alimentos.forEach(alimento => {
                          console.log('Nombre del alimento:', alimento.nombre, 'Precio:', alimento.precio);
                        });
                      } else {
                        console.log('La lista no tiene alimentos o está vacía.');
                      }
                    },
                    error => {
                      console.error('Error al obtener los detalles de los alimentos:', error);
                    }
                  );
              });
            } else {
              console.warn('El usuario no tiene listas definidas.');
              this.listasDeUsuario = []; // Asegurarse de que listasDeUsuario esté vacío si no hay listas
            }
          },
          error => {
            console.error('Error al obtener listas del usuario:', error);
          }
        );
    } else {
      console.error('UID del usuario no disponible.');
    }
  }
  
  

  verDetallesLista(id: string) {
    this.navCtrl.navigateForward(['/tabs/detnewlist', id]);
  }
}
