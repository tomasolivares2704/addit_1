import { Component, Input, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ModalController } from '@ionic/angular';
import { Foods } from 'src/app/models/food.models';

@Component({
  selector: 'app-tab-nutri-modal',
  templateUrl: './tab-nutri-modal.component.html',
  styleUrls: ['./tab-nutri-modal.component.scss'],
})
export class TabNutriModalComponent implements OnInit {
  @Input() foodId: string;
  food: Foods;

  constructor(
    private firebaseSvc: FirebaseService,
    private modalController: ModalController,
  ) {}

  ngOnInit() {
    if (this.foodId) {
      this.getFoodDetails(this.foodId);
    } else {
      console.error('No food ID provided');
    }
  }

  getFoodDetails(id: string) {
    this.firebaseSvc.getFoodById(id).subscribe(
      (food) => {
        this.food = food;
      },
      (error) => {
        console.error('Error fetching food details:', error);
      }
    );
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
