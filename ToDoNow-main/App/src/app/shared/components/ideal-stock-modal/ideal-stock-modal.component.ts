import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { myfood } from 'src/app/models/myfood.models';
import { User } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-ideal-stock-modal',
  templateUrl: './ideal-stock-modal.component.html',
  styleUrls: ['./ideal-stock-modal.component.scss'],
})
export class IdealStockModalComponent  implements OnInit {

  @Input() food: myfood;
  tempIdealStock: number;
  

  constructor(
    private modalCtrl: ModalController,
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
  ) {}

  ngOnInit(): void {
    this.tempIdealStock = this.food.stock_ideal; 
  }

  incrementStockIdeal() {
    this.tempIdealStock++;
  }

  decrementStockIdeal() {
    if (this.tempIdealStock > 0) {
      this.tempIdealStock--;
    }
  }

  async confirmIdealStockChanges() {
    let user: User = this.utilsSvc.getElementInLocalStorage('user');
    let path = `user/${user.uid}/myfoods/${this.food.id}`;
    const updateObject = { stock_ideal: this.tempIdealStock };
    
    try {
      await this.firebaseSvc.updateDocument(path, updateObject);
      this.utilsSvc.presentToast({
        message: 'Stock ideal actualizado correctamente.',
        duration: 2000,
        color: 'success'
      });
      this.closeModal();
    } catch (error) {
      console.error('Error al actualizar el stock ideal:', error);
      this.utilsSvc.presentToast({
        message: 'Error al actualizar el stock ideal.',
        duration: 2000,
        color: 'danger'
      });
    }
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}