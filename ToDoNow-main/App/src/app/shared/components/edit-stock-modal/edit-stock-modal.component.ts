import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { myfood } from 'src/app/models/myfood.models';

@Component({
  selector: 'app-edit-stock-modal',
  templateUrl: './edit-stock-modal.component.html',
  styleUrls: ['./edit-stock-modal.component.scss'],
})
export class EditStockModalComponent  implements OnInit {

  @Input() food: myfood;
  @Output() stockUpdated = new EventEmitter<myfood>();

  constructor(private modalCtrl: ModalController) {}

  ngOnInit(): void {
    
  }

  incrementStock() {
    this.food.stock++;
  }

  decrementStock() {
    if (this.food.stock > 0) {
      this.food.stock--;
    }
  }

  confirmStockChange() {
    this.stockUpdated.emit(this.food);
    this.closeModal();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
