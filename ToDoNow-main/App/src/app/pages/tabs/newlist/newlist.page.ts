import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { NewList } from 'src/app/models/newlist.models';
import { NavController } from '@ionic/angular';
import { User } from 'src/app/models/user.models';

import { Foods } from 'src/app/models/food.models';
import { AlimentoListaCompra } from 'src/app/models/newlist.models';

import { myfood } from 'src/app/models/myfood.models';

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
  alimentosadd: { nombre: string, cantidad: number }[] = []; // Nuevo array de alimentos con nombre y cantidad
  myfoods: myfood[] = [];  

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
    console.log('ID DEL USUARIOS:', this.user.uid);
  }
  

  crearNuevaLista() {
    if (this.nombreLista && this.user.uid) {
      this.firebaseService.getAllFoods().subscribe(
        (foods: Foods[]) => {
          const alimentos: AlimentoListaCompra[] = [];

          foods.forEach((food, index) => {
            const alimento: AlimentoListaCompra = {
              id: food.id || `food_${index}`,
              nombre: food.name,
              cantidad: 0,
              precio: food.price,
              precio2: food.price2,
              subtotal: 0,
              subtotal2: 0,
            };
            alimentos.push(alimento);
          });

          // Crear la nueva lista en Firestore
          const newList: NewList = {
            id: '', // Se asignará automáticamente por Firestore
            nombre: this.nombreLista,
            total: 0, // Puedes calcular esto según sea necesario
            total2: 0, // Puedes calcular esto según sea necesario
            alimentos: alimentos, // Asignar el array de alimentos directamente
          };

          this.firebaseService.crearNewList(this.user.uid, newList)
            .then((newListId) => {
              newList.id = newListId;
              this.newlist = newList; // Asignar la nueva lista creada a newlist
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
  
              // Usar un conjunto para evitar duplicados
              const alimentosSet = new Set<{ nombre: string, cantidad: number }>();
  
              // Iterar sobre cada lista para cargar los alimentos
              listas.forEach(lista => {
                console.log('ID de la lista:', lista.id);
                console.log('Nombre de la lista:', lista.nombre);
  
                // Obtener los detalles de la lista incluyendo alimentos
                this.firebaseService.obtenerDetallesAlimentos(this.user.uid, lista.id)
                  .subscribe(
                    (listaConAlimentos: NewList | null) => {
                      if (listaConAlimentos && listaConAlimentos.alimentos) {
                        console.log('Alimentos de la lista:', listaConAlimentos.alimentos);
                        // Iterar sobre los alimentos de la lista y agregarlos al conjunto
                        listaConAlimentos.alimentos.forEach(alimento => {
                          if (alimento.cantidad > 0) {
                            alimentosSet.add({ nombre: alimento.nombre, cantidad: alimento.cantidad });
                          }
                        });
  
                        // Convertir el conjunto a un arreglo al final
                        this.alimentosadd = Array.from(alimentosSet);
  
                        // Agregar console.log para verificar si se guardaron los alimentos en alimentosadd
                        console.log('Alimentos agregados:', this.alimentosadd);
                      } else {
                        console.log('La lista no tiene alimentos o está vacía.');
                      }
                    },
                    error => {
                      console.error('Error al obtener los detalles de los alimentos de la lista:', error);
                    }
                  );
              });
            } else {
              console.warn('El usuario no tiene listas definidas.');
              // Reinicializar alimentosadd como un aarray vacío si no hay listas
              this.alimentosadd = [];
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
  
  

  

  eliminarLista(id: string) {
        this.utilsSvc.presentAlert({
          header: 'Confirmación',
          message: '¿Estás seguro de que deseas eliminar esta lista?',
          buttons: [
            {
              text: 'Cancelar',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                console.log('Eliminación cancelada');
              }
            }, {
              text: 'Eliminar',
              handler: () => {
                this.firebaseService.deleteDocument(`user/${this.user.uid}/newlist/${id}`)
                  .then(() => {
                    console.log('Lista eliminada correctamente');
                    // Aquí podrías actualizar la lista de nuevo si es necesario
                    this.utilsSvc.presentToast({ message: 'Lista eliminada correctamente' });
                  })
                  .catch(error => {
                    console.error('Error al eliminar la lista:', error);
                    this.utilsSvc.presentToast({ message: 'Error al eliminar la lista. Inténtalo nuevamente' });
                  });
              }
            }
          ]
        });

     }

     verDetallesLista(id: string) {
      this.navCtrl.navigateForward(['/tabs/detnewlist', id]);
  }


  
 






    

}
  
  
  
  
  
  
  
  

 


