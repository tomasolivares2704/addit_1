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
    this.getAllFoods();
    this.loadNewListDetails();
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
        //console.log('Alimentos recibidos:', foods);
        this.initNewListFromFoods();
      },
      (error) => {
        console.error('Error al obtener alimentos:', error);
        this.loading = false;
      }
    );
  }

  initNewListFromFoods() {
    this.newlist.alimentos = [];
    this.foods.forEach((food, index) => {
      // Usar un ID único generado automáticamente por Firebase si food.id no está definido
      const alimento: AlimentoListaCompra = {
        id: food.id || `food_${index}`, // Usar un ID predeterminado si food.id no está disponible
        nombre: food.name,
        cantidad: 0,
        precio: food.price,
        subtotal: 0,
      };
      this.newlist.alimentos.push(alimento);
    });
  }
  

  calcularSubtotal() {
    this.newlist.total = 0;
    this.newlist.alimentos.forEach(alimento => {
      alimento.subtotal = alimento.cantidad * alimento.precio;
      this.newlist.total += alimento.subtotal;
    });
  }

  async guardarCambios() {
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
  
    // Crear un array de promesas para todas las actualizaciones de alimentos
    const promises = this.newlist.alimentos.map(alimento => {
        // Validar el ID del alimento
        if (!alimento.id) {
            console.error('El ID del alimento es inválido.');
            console.error('Alimento:', alimento);
            return Promise.reject('ID de alimento inválido');
        }
      
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
    try {
        await Promise.all(promises);
        console.log('Todos los alimentos actualizados exitosamente.');
    } catch (error) {
        console.error('Error al actualizar uno o más alimentos:', error);
    }
}


  
  

  calcularTotal(): number {
    let total = 0;
    this.newlist.alimentos.forEach(alimento => {
      //console.log('Cantidad:', alimento.cantidad, 'Precio:', alimento.precio);
      total += alimento.cantidad * alimento.precio;
    });
    //console.log('Total calculado:', total);
    return total;
  }
  
  
  

}
