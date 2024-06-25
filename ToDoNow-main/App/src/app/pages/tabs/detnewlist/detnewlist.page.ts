import { ActivatedRoute } from '@angular/router';
import { NewList, AlimentoListaCompra } from 'src/app/models/newlist.models';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    this.getUser(); // Obtener el usuario al iniciar el componente

    this.route.paramMap.subscribe(params => {
      const newListId = params.get('id');
      if (newListId) {
        this.loading = true;
        if (this.user && this.user.uid) {
          // Utilizar el userId obtenido del usuario actual
          const userId = this.user.uid;
          this.firebaseSvc.obtenerDetallesLista(userId, newListId).subscribe(
            (lista: NewList) => {
              this.newlist = lista;
              console.log('Detalles de la lista: EN DETNEWLIST', this.newlist);
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
    alimento.cantidad = nuevaCantidad;
    alimento.subtotal = alimento.cantidad * alimento.precio;
    this.actualizarTotalLista();
  }

  actualizarCantidad2(alimento: AlimentoListaCompra, nuevaCantidad: number) {
    alimento.cantidad = nuevaCantidad;
    alimento.subtotal2 = alimento.cantidad * alimento.precio2;
    this.actualizarTotalLista2();
  }

  actualizarTotalLista() {
    if (this.newlist && this.newlist.alimentos) {
      this.newlist.total = this.newlist.alimentos.reduce((total, alimento) => {
        return total + (alimento.cantidad * alimento.precio);
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

  actualizarTotalLista2() {
    if (this.newlist && this.newlist.alimentos) {
      this.newlist.total2 = this.newlist.alimentos.reduce((total2, alimento) => {
        return total2 + (alimento.cantidad * alimento.precio2);
      }, 0);
      this.firebaseSvc.actualizarLista2(this.user.uid, this.newlist.id, this.newlist)
        .then(() => {
          console.log('Lista Nº2 actualizada correctamente en la base de datos.');
        })
        .catch(error => {
          console.error('Error al actualizar lista Nº2 en la base de datos:', error);
        });
    }
  }



  
}
