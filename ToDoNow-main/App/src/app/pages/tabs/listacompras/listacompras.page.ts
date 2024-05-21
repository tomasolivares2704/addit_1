import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { List} from 'src/app/models/list.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ModalController } from '@ionic/angular';
import { CreateListModalComponent } from 'src/app/shared/components/create-list-modal/create-list-modal.component';

@Component({
  selector: 'app-listacompras',
  templateUrl: './listacompras.page.html',
  styleUrls: ['./listacompras.page.scss'],
})
export class ListacomprasPage implements OnInit {

  lists: List[] = [];

  constructor(
    private firebaseService: FirebaseService,
    private router: Router,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.loadLists();
  }

  loadLists() {
    this.firebaseService.getLists().subscribe((lists: List[]) => {
      this.lists = lists;
    });
  }

  openList(listId: string) {
    this.router.navigate(['/detallelista', listId]);
  }

  async openCreateListModal() {
    const modal = await this.modalController.create({
      component: CreateListModalComponent,
      cssClass: 'custom-modal',
      backdropDismiss: true
    });

    modal.onDidDismiss().then((data) => {
      if (data.data && data.data.listCreated) {
        this.loadLists();
      }
    });

    return await modal.present();
  }

}
