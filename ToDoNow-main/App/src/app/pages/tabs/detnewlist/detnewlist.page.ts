import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewList, AlimentoListaCompra } from 'src/app/models/newlist.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.models';

@Component({
  selector: 'app-detnewlist',
  templateUrl: './detnewlist.page.html',
  styleUrls: ['./detnewlist.page.scss'],
})
export class DetnewlistPage implements OnInit {
  newlist: NewList = null;
  loading: boolean = false;
  user: User;

  constructor(
    private route: ActivatedRoute,
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) { }

  ngOnInit() {
    this.getUser();

    this.route.paramMap.subscribe(params => {
      const newListId = params.get('id');
      if (newListId) {
        this.loading = true;
        if (this.user && this.user.uid) {
          this.firebaseSvc.obtenerDetallesLista(this.user.uid, newListId).subscribe(
            (lista: NewList) => {
              this.newlist = lista;
              this.newlist.alimentos.forEach(alimento => {
                alimento.precioSeleccionado = alimento.precioSeleccionado ?? alimento.precio; // Asegurarse de mantener el valor si ya está seleccionado
              });
              this.loading = false;
            },
            error => {
              console.error('Error al obtener detalles de la lista:', error);
              this.loading = false;
            }
          );
        } else {
          console.error('No se pudo obtener el userId del usuario.');
          this.loading = false;
        }
      }
    });
  }

  getUser() {
    this.user = this.utilsSvc.getElementInLocalStorage('user');
  }

  actualizarCantidad(alimento: AlimentoListaCompra, nuevaCantidad: number) {
    if (nuevaCantidad >= 0) {
      alimento.cantidad = nuevaCantidad;
      alimento.subtotal = alimento.cantidad * alimento.precio;
      alimento.subtotal2 = alimento.cantidad * alimento.precio2;
      this.actualizarTotalLista();
    }
  }

  actualizarTotalLista() {
    if (this.newlist && this.newlist.alimentos) {
      this.newlist.total = this.newlist.alimentos.reduce((total, alimento) => {
        return total + (alimento.cantidad * alimento.precioSeleccionado);
      }, 0);
      this.firebaseSvc.actualizarLista(this.user.uid, this.newlist.id, this.newlist)
        .then(() => {
          console.log('Lista actualizada correctamente en la base de datos.');
        })
        .catch(error => {
          console.error('Error al actualizar lista en la base de datos:', error);
        });
    }
  }

  actualizarPrecioSeleccionado(alimento: AlimentoListaCompra, nuevoPrecio: number) {
    alimento.precioSeleccionado = nuevoPrecio;
    this.actualizarSubtotal(alimento);
    this.actualizarTotalLista();
  }
  
  actualizarSubtotal(alimento: AlimentoListaCompra) {
    alimento.subtotal = alimento.cantidad * alimento.precioSeleccionado;
  }
}
