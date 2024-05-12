import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user = {} as User;

  constructor(
    private firebaseSrv: FirebaseService,
    private utilsSvc: UtilsService,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getUser();
  }

  getUser() {
    return this.user = this.utilsSvc.getElementInLocalStorage('user');
  }

  signOut() {
    this.utilsSvc.presentAlert({
      header: 'Cerrar Sesión',
      message: '¿Quieres cerrar sesión?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        }, {
          text: 'Si, cerrar',
          handler: () => {
            this.firebaseSrv.signOut();
          }
        }
      ]
    });
  }
}
