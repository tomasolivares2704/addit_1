import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { NewList } from 'src/app/models/newlist.models';
import { NavController } from '@ionic/angular';
import { User } from 'src/app/models/user.models';


@Component({
  selector: 'app-newlist',
  templateUrl: './newlist.page.html',
  styleUrls: ['./newlist.page.scss'],
})
export class NewlistPage implements OnInit {

  nombreLista: string;
  user = {} as User;
  listasDeUsuario: NewList[] = [];

  

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
    // Obtener los datos del usuario del almacenamiento local
    this.user = this.utilsSvc.getElementInLocalStorage('user');
    
    // Verificar si el usuario tiene el rol de administrador
    if (this.user && this.user.isAdmin) {
      // Si el usuario es administrador, establecer isAdmin en true en el almacenamiento local
      this.utilsSvc.setElementInLocalStorage('isAdmin', true);
    }
  }

  crearNuevaLista() {
    if (this.nombreLista && this.user.uid) { // Verificar que haya un nombre de lista y un UID de usuario
      const nuevaLista: NewList = {
        id: '', // Este será generado automáticamente por Firebase
        nombre: this.nombreLista,
        alimentos: [] // Puedes inicializar la lista de alimentos aquí si es necesario
      };

      this.firebaseService.crearNewList(this.user.uid, nuevaLista) // Utilizar el UID del usuario
        .then(() => {
          console.log('Nueva lista creada exitosamente.');
          // Redireccionar a la página de listas u otra página según sea necesario
          this.navCtrl.navigateRoot('/ruta_de_la_pagina_de_listas');
        })
        .catch(error => {
          console.error('Error al crear nueva lista:', error);
        });
    } else {
      console.error('El nombre de la lista es obligatorio.');
    }
  }

  obtenerListasDeUsuario() {
    if (this.user && this.user.uid) {
      this.firebaseService.obtenerNewListDeUsuario(this.user.uid)
        .subscribe(listas => {
          this.listasDeUsuario = listas;
          console.log('Listas del usuario:', listas);
        }, error => {
          console.error('Error al obtener listas del usuario:', error);
        });
    } else {
      console.error('UID del usuario no disponible.');
    }
  }

  verDetallesLista(id: string) {
    this.navCtrl.navigateForward(['/tabs/detnewlist', id]); // Redirigir a la vista detnewlist con el ID de la lista como parámetro
  }





}
