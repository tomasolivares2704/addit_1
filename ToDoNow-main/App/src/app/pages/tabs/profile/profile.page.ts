import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.models';
import { Profile } from 'src/app/models/NProfile.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { getAuth, deleteUser } from 'firebase/auth';
import { NProfileService } from 'src/app/services/NProfile.service';
import { ModalController } from '@ionic/angular';
import { CreateProfileModalComponent } from 'src/app/shared/components/create-profile-modal/create-profile-modal.component';
import { ChangeEmailModalComponent } from 'src/app/shared/components/change-email-modal/change-email-modal.component';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  user = {} as User;
  profiles: Profile[] = [];
  activeProfile: Profile | null = null;

  constructor(
    private firebaseService: FirebaseService,
    private utilsService: UtilsService,
    private profileService: NProfileService,
    private modalController: ModalController,
    private auth: AngularFireAuth, // Inject AngularFireAuth
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getUser();
    this.getProfiles();
  }

  getUser() {
    return this.user = this.utilsService.getElementInLocalStorage('user');
  }

  signOut() {
    this.utilsService.presentAlert({
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
            this.firebaseService.signOut();
          }
        }
      ]
    });
  }

  deleteAccount() {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (user) {
      // Primero elimina el documento del usuario en Firestore
      this.firebaseService.deleteDocument(`user/${user.uid}`).then(() => {
        // Luego intenta eliminar al usuario de Firebase Auth
        deleteUser(user).then(() => {
          console.log('Su cuenta ha sido eliminada con éxito');
          // Limpia el localStorage después de la eliminación exitosa
          localStorage.clear();
          // Redirecciona al usuario
          this.utilsService.routerLink('/auth');
        }).catch((error) => {
          console.error('Error al eliminar la cuenta:', error);
        });
      }).catch((error) => {
        console.error('Error al eliminar el documento del usuario en Firestore:', error);
      });
    } else {
      console.error('No hay un usuario autenticado actualmente.');
    }
  }

  //PERFILES NUTRICIONALES//
  getProfiles(){

    const user: User = this.utilsService.getElementInLocalStorage('user')

    const path = `user/${user.uid}`;

    this.firebaseService.getSubcollection(path, 'profile').subscribe((res: Profile[]) => {
        console.log(res);
        this.profiles = res;

        this.activeProfile = res.find(profile => profile.isActivated) || null;
        console.log('Los perfiles activos son:', this.activeProfile);
    });
  }

  async openCreateProfileModal() {
    const modal = await this.modalController.create({
      component:  CreateProfileModalComponent,
      cssClass: 'custom-modal',
      backdropDismiss: true
    });

    modal.onDidDismiss().then((data) => {
      if (data.data && data.data.listCreated) {
        this.getProfiles();
      }
    });

    return await modal.present();
  }

  toggleChanged(id: string, event: any) {
    const isChecked = event.detail.checked;
    console.log('Toggle ID:', id, 'checked:', isChecked);  // Verificar el estado en la consola
    
    const user: User = this.utilsService.getElementInLocalStorage('user');
    const path = `user/${user.uid}/profile/${id}`;

    const updateData = { isActivated: isChecked };

    this.firebaseService.updateDocument(path, updateData)
      .then(() => {
        console.log(`Profile ${id} updated successfully to ${isChecked}`);
      })
      .catch(error => {
        console.error('Error updating profile:', error);
      });
  }

  async openChangeEmailModal() {
    const modal = await this.modalController.create({
      component: ChangeEmailModalComponent,
      cssClass: 'custom-modal',
      backdropDismiss: true,
      componentProps: {
        auth: this.auth, // Pasa el servicio 'auth'
      }
    });

    // Maneja la respuesta de la modal cuando se cierra
    modal.onDidDismiss().then((data) => {
      if (data.data && data.data.emailUpdated) {
        // Si se actualizó el email, actualiza la información del usuario
        this.getUser(); 
      }
    });

    return await modal.present();
  }

}