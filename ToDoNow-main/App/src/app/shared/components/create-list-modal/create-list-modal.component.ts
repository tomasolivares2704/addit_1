import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { List } from 'src/app/models/list.models';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-create-list-modal',
  templateUrl: './create-list-modal.component.html',
  styleUrls: ['./create-list-modal.component.scss'],
})
export class CreateListModalComponent implements OnInit {

  list: List = {
    title: '',
    image: '',
    purchaseFrequency: '',
    products: [],
    createdAt: new Date()
  };

  constructor(
    private modalController: ModalController,
    private firebaseService: FirebaseService
  ) {}

  ngOnInit() {}

  dismiss() {
    this.modalController.dismiss();
  }

  submitForm() {
    this.firebaseService.createList(this.list).then(() => {
      this.modalController.dismiss({ listCreated: true });
    }).catch(error => {
      console.error("Error al crear la lista", error);
    });
  }
}
