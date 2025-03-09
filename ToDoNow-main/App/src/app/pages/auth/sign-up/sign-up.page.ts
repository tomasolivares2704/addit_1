import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { User } from 'src/app/models/user.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CustomValidators } from 'src/app/utils/custom-validators';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl(''),
  });

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.confirmPasswordValidator();
  }

  confirmPasswordValidator() {
    this.form.controls.confirmPassword.setValidators([
      Validators.required,
      CustomValidators.matchValues(this.form.controls.password)
    ])
    this.form.controls.confirmPassword.updateValueAndValidity();
  }

  submit() {
    if (this.form.valid) {
      this.utilsSvc.presentLoading({ message: 'Registrando...' });
      const { name, email, password } = this.form.value;
  
      const newUser: User = {
        uid: '', // Firebase asignará este valor automáticamente al crear el usuario
        name: name,
        email: email,
        password: password,
        isAdmin: false // Por defecto, los usuarios no son administradores
      };
  
      this.firebaseSvc.signUp(newUser).then(async res => {
        await res.user.sendEmailVerification();
        await this.firebaseSvc.updateUser({ displayName: newUser.name });
  
        // Asignar el UID generado por Firebase al usuario
        newUser.uid = res.user.uid;
  
        await this.firebaseSvc.createUserDocument(newUser);
  
        this.utilsSvc.setElementInLocalStorage('user', newUser);
        this.utilsSvc.routerLink('/auth');
        this.utilsSvc.dismissLoading();
  
        this.utilsSvc.presentToast({
          message: `Registro exitoso. Por favor, verifica tu correo electrónico.`,
          duration: 5000,
          color: 'primary',
          icon: 'mail-outline',
          mode: 'ios'
        });
        this.form.reset();
      }).catch(error => {
        this.utilsSvc.dismissLoading();
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 5000,
          color: 'warning',
          icon: 'alert-circle-outline'
        });
      });
    }
  }
  
  limpiar(){
    this.form.reset();
  }

  
  goBack() {
    this.navCtrl.back();
  }
}