import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsService } from 'src/app/services/utils.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.models';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) { }

  ngOnInit() {
  }

  submit() {
    if (this.form.valid) {
      this.utilsSvc.presentLoading({ message: 'Autenticando...', mode: 'ios' });
      this.firebaseSvc.login(this.form.value as User).then(async res => {
        const user = res.user;
        if (user && user.emailVerified) {
          let userData: User = {
            uid: user.uid,
            name: user.displayName || '',
            email: user.email || ''
          };

          this.utilsSvc.setElementInLocalStorage('user', userData);
          this.utilsSvc.dismissLoading();
          this.utilsSvc.routerLink('/tabs/inventory');

          this.utilsSvc.presentToast({
            message: `Bienvenido ${userData.name}`,
            duration: 1500,
            color: 'primary',
            icon: 'person-outline',
            mode: 'ios'
          });

          this.form.reset();
        } else {
          this.utilsSvc.dismissLoading();
          this.utilsSvc.presentToast({
            message: 'Debes verificar tu correo electrónico para iniciar sesión.',
            duration: 5000,
            color: 'warning',
            icon: 'alert-circle-outline',
            mode: 'ios'
          });
        }
      }).catch(error => {
        this.utilsSvc.dismissLoading();
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 5000,
          color: 'warning',
          icon: 'alert-circle-outline',
          mode: 'ios'
        });
      });
    }
  }
}