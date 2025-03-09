import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ModalController } from '@ionic/angular';
import { myfood } from 'src/app/models/myfood.models';
import { User } from 'src/app/models/user.models';

@Component({
  selector: 'app-edit-stock-modal',
  templateUrl: './edit-stock-modal.component.html',
  styleUrls: ['./edit-stock-modal.component.scss'],
})
export class EditStockModalComponent  implements OnInit {
  @Input() food: myfood;
  @Output() updateFood = new EventEmitter<myfood>();
  tempStock: number;  

  constructor(
    private modalCtrl: ModalController,
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
  ) {}

  ngOnInit(): void {
    this.tempStock = this.food.stock;
  }

  incrementStock() {
    this.tempStock++;  // Update the temporary stock
  }

  decrementStock() {
    if (this.tempStock > 0) {
      this.tempStock--;  // Update the temporary stock
    }
  }

  async confirmChanges() {
    let user: User = this.utilsSvc.getElementInLocalStorage('user');
    let path = `user/${user.uid}/myfoods/${this.food.id}`;
    const updateObject = { stock: this.tempStock };

    try {
      await this.firebaseSvc.updateDocument(path, updateObject);
      this.utilsSvc.presentToast({
        message: 'Stock actualizado correctamente.',
        duration: 2000,
        color: 'success'
      });
      this.closeModal();
    } catch (error) {
      console.error('Error al actualizar el stock:', error);
      this.utilsSvc.presentToast({
        message: 'Error al actualizar el stock.',
        duration: 2000,
        color: 'danger'
      });
    }
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}