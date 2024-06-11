import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ActivatedRoute } from '@angular/router';
import { NewList, AlimentoListaCompra } from 'src/app/models/newlist.models';
import { UtilsService } from 'src/app/services/utils.service';
import { Foods } from 'src/app/models/food.models';

@Component({
  selector: 'app-detnewlist',
  templateUrl: './detnewlist.page.html',
  styleUrls: ['./detnewlist.page.scss'],
})
export class DetnewlistPage implements OnInit {
  newlist: NewList = { id: '', nombre: '', total: 0, alimentos: [] };
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
    console.log('List ID en loadNewListDetails:', listId); // Agregamos esta línea para depuración
    if (listId) {
      this.newlist.id = listId;
      this.firebaseSvc.obtenerDetallesLista(this.userUid, listId).subscribe(
        (list) => {
          this.newlist = list;
          // Obtener detalles de los alimentos
          this.loadAlimentosDetails(listId);
        },
        (error) => {
          console.error('Error al obtener los detalles de la lista:', error);
        }
      );
    } else {
      console.error('No se encontró el ID de la lista en la ruta');
    }
  }

  loadAlimentosDetails(listId: string) {
    this.firebaseSvc.obtenerDetallesAlimentos(this.userUid, listId).subscribe(
      (alimentos) => {
        // Asignar los detalles de los alimentos a la lista
        this.newlist.alimentos = alimentos;
      },
      (error) => {
        console.error('Error al obtener los detalles de los alimentos:', error);
      }
    );
  }

  guardarCambios() {
    console.log('Guardando cambios...');
  
    // Obtener el ID de la lista
    const listId = this.route.snapshot.paramMap.get('id');
    console.log('List ID XD:', listId);
  
    // Verificar si el ID de la lista está presente y válido
    if (!listId) {
      console.error('ID de lista no encontrado.');
      return;
    }
  
    // Calcular los subtotales antes de guardar los cambios
    this.calcularSubtotal();
  
    // Filtrar los alimentos con IDs válidos
    const alimentosValidos = this.newlist.alimentos.filter(alimento => alimento.id);
  
    // Crear un array de promesas para todas las actualizaciones de alimentos
    const promises = alimentosValidos.map(alimento => {
      // Actualizar el alimento en Firestore
      return this.firebaseSvc.actualizarAlimento(this.userUid, listId, alimento)
        .then(() => {
          console.log('Alimento actualizado exitosamente:', alimento);
        })
        .catch(error => {
          console.error('Error al actualizar el alimento:', error);
          return Promise.reject(error);
        });
    });
  
    // Esperar a que todas las actualizaciones se completen
    Promise.all(promises)
      .then(() => {
        console.log('Todos los alimentos actualizados exitosamente XSSS.');
      })
      .catch(error => {
        console.error('Error al actualizar uno o más alimentos:', error);
      });
  }
  

  calcularSubtotal() {
    this.newlist.total = 0;
    this.newlist.alimentos.forEach(alimento => {
      alimento.subtotal = alimento.cantidad * alimento.precio;
      this.newlist.total += alimento.subtotal;
    });
  }

  calcularTotal(): number {
    let total = 0;
    this.newlist.alimentos.forEach(alimento => {
      total += alimento.cantidad * alimento.precio;
    });
    return total;
  }
}
