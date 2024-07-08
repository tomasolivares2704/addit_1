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
  @Output() updateFood = new EventEmitter<myfood>();
  tempStock: number;  // Temporary variable for UI updates

  constructor(private modalCtrl: ModalController) {}

  ngOnInit(): void {
    this.tempStock = this.food.stock; // Initialize tempStock with the current stock
  }

  incrementStock() {
    this.tempStock++;  // Update the temporary stock
  }

  decrementStock() {
    if (this.tempStock > 0) {
      this.tempStock--;  // Update the temporary stock
    }
  }

  confirmChanges() {
    this.food.stock = this.tempStock;  // Apply the temporary stock to the actual food stock
    this.updateFood.emit(this.food);  // Emit the updated food
    this.closeModal();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}