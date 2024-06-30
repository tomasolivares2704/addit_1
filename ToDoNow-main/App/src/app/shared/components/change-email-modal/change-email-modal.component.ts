import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-change-email-modal',
  templateUrl: './change-email-modal.component.html',
  styleUrls: ['./change-email-modal.component.scss'],
})
export class ChangeEmailModalComponent implements OnInit {
  @Input() auth: AngularFireAuth; // Recibe el servicio 'auth' como entrada

  form = new FormGroup({
    newemail: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private modalCtrl: ModalController
  ) { }

  ngOnInit() {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  async submit() {
    if (this.form.valid) {
      const { newemail, password } = this.form.value;
      await this.utilsSvc.presentLoading({ message: 'Actualizando correo...' });

      try {
        const user = await this.auth.currentUser;
        if (user) {
          // Reautenticación con la contraseña actual
          await this.firebaseSvc.reauthenticate(user.email, password);

          // Actualizar el email en Firebase Auth
          await this.firebaseSvc.updateEmail(newemail);

          // Enviar correo de verificación
          await this.firebaseSvc.sendVerificationEmail(user);

          // Cerrar la modal
          await this.utilsSvc.dismissLoading();
          this.utilsSvc.presentToast({
            message: 'Correo de verificación enviado. Por favor, verifica tu nuevo correo electrónico.',
            duration: 5000,
            color: 'primary',
            icon: 'mail-outline',
            mode: 'ios'
          });
          this.form.reset();
          this.dismiss();
          this.modalCtrl.dismiss({ emailUpdated: true }); 
        } else {
          throw new Error('No user is currently signed in.');
        }
      } catch (error) {
        await this.utilsSvc.dismissLoading();
        this.utilsSvc.presentToast({
          message: 'Error al actualizar el correo: ' + error.message,
          duration: 5000,
          color: 'danger',
          icon: 'alert-circle-outline'
        });
      }
    }
  }
}