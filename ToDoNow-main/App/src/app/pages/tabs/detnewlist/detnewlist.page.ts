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
    this.foods.forEach(food => {
      const alimento: AlimentoListaCompra = {
        id: food.id,
        nombre: food.name,
        cantidad: 0,
        precio: food.price, // Agregar el precio del alimento al inicializar
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

  guardarCambios() {
    console.log('Guardando cambios...');
    // Calcular los subtotales antes de guardar los cambios
    this.calcularSubtotal();
    // Iterar sobre la lista de alimentos
    this.newlist.alimentos.forEach(alimento => {
      // Aquí puedes agregar la lógica para guardar cada alimento modificado
      // Por ejemplo, si tienes un servicio de Firebase, podrías actualizar cada documento de la subcolección correspondiente
      this.firebaseSvc.actualizarAlimento(this.userUid, this.newlist.id, alimento)
        .then(() => {
          //console.log('Alimento actualizado exitosamente:', alimento);
        })
        .catch(error => {
          console.error('Error al actualizar el alimento:', error);
        });
    });
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
