import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { List} from 'src/app/models/list.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { CreateListModalComponent } from 'src/app/shared/components/create-list-modal/create-list-modal.component';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.models';

@Component({
  selector: 'app-listacompras',
  templateUrl: './listacompras.page.html',
  styleUrls: ['./listacompras.page.scss'],
})
export class ListacomprasPage implements OnInit {

  user = {} as User;
  lists: List[] = [];
  loading: boolean = false;
  deleteMode: boolean = false;

  constructor(
    private firebaseService: FirebaseService,
    private utilsService: UtilsService,
    private router: Router,
    private modalController: ModalController,
    private alertController: AlertController,
  ) {}

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getLists()
    this.getUser()
    
  }

  //Obtiene el ide del usuario logeado
  getUser() {
    return this.user = this.utilsService.getElementInLocalStorage('user');
  }

  //Obtiene las listas creadas por el usuario
  getLists(){
    // Obtener Objeto User
    const user: User = this.utilsService.getElementInLocalStorage('user')
    // Crea Ruta
    const path = `user/${user.uid}`;
    //Obtiene la SubCollecion
    this.firebaseService.getSubcollection(path, 'list').subscribe((res: List[]) => {
        console.log(res);
        this.lists = res;
    });
  }

  openList(listId: string) {
    this.router.navigate(['/detalle-lista', listId]);
  }

  async openCreateListModal() {
    const modal = await this.modalController.create({
      component: CreateListModalComponent,
      cssClass: 'custom-modal',
      backdropDismiss: true
    });

    modal.onDidDismiss().then((data) => {
      if (data.data && data.data.listCreated) {
        this.getLists();
      }
    });

    return await modal.present();
  }

  //Eliminar listas
  toggleDeleteMode() {
    this.deleteMode = !this.deleteMode;
  }

  async confirmDeleteList(list: List) {
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar la lista "${list.title}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            await this.deleteList(list.id);
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteList(listId: string) {
    const path = `user/${this.user.uid}/list/${listId}`;
    try {
      await this.firebaseService.deleteDocument(path);
      this.getLists(); // Refresh the list after deletion
      this.toggleDeleteMode(); // Exit delete mode after deletion
    } catch (error) {
      console.error('Error al eliminar la lista:', error);
    }
  }

}
