import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { myfood } from 'src/app/models/myfood.models';
import { User } from 'src/app/models/user.models';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular'; 


@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.scss'],
})
export class NotificacionesComponent  implements OnInit {

  myfoods: myfood[] = [];
  loading: boolean = true;
  user = {} as User;
  isAlertOpen: boolean = false;
  alertButtons = ['OK'];

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private modalController: ModalController, 
    private alertController: AlertController,
  ) {
    
    
   }

  ngOnInit() {
    this.getUser();
    this.getMyFoods();
    this.checkStockLevels();


  }

  getUser() {
    const user = this.utilsSvc.getElementInLocalStorage('user');
    if (user) {
      this.user = user;
    } else {
      console.error('No se encontró el usuario en el almacenamiento local');
    }
  }
  

  getMyFoods() {
    let user: User = this.utilsSvc.getElementInLocalStorage('user');
    let path = `user/${user.uid}`;
    this.loading = true;
  
    this.firebaseSvc.getSubcollection(path, 'myfoods').subscribe({
      next: (myfoods: myfood[]) => {
        console.log(myfoods);
        this.myfoods = myfoods;
        this.loading = false;
      }
    });
  }

  async checkStockLevels() {
    if (!this.myfoods || this.myfoods.length === 0) return;
  
    for (const food of this.myfoods) {
      const diferencia = food.stock - food.stock_ideal;
      const faltante =  food.stock_ideal - food.stock ;
  
      if (diferencia < 0) {
        await this.presentAlert(`El alimento ${food.name} No tiene suficiente stock, tiene un faltante de: ${faltante} `);
      } 
      if (diferencia === 0) {
        await this.presentAlert(`No posees stock de ${food.name} `);
      }
    }
  }
  

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Notificación',
      message: message,
      buttons: this.alertButtons
    });

    await alert.present();
  }
  
  

  

}
