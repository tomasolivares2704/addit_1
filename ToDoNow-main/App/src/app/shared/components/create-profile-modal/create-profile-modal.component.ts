import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.models';
import { Profile } from 'src/app/models/NProfile.models';

@Component({
  selector: 'app-create-profile-modal',
  templateUrl: './create-profile-modal.component.html',
  styleUrls: ['./create-profile-modal.component.scss'],
})
export class CreateProfileModalComponent  implements OnInit {

  profileForm: FormGroup;

  user = {} as User;

  constructor(
    private modalController: ModalController,
    private firebaseService: FirebaseService,
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private router: Router,
  ) {}

  ngOnInit() {
    this.getUser();
    this.initForm();
    
  }

  getUser() {
    return this.user = this.utilsService.getElementInLocalStorage('user');
  }
  
  initForm() {
    this.profileForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      calories: ['', Validators.required],
      protein: ['', Validators.required],
      carbs: ['', Validators.required],
    });
  }

  //Crear una nueva lista
  async createNewProfile() {
    const newProfileData: Profile = {
      id: this.firebaseService.generateId(),
      nombre: this.profileForm.value.nombre,
      calories: this.profileForm.value.calories,
      protein: this.profileForm.value.protein,
      carbs: this.profileForm.value.carbs,
    };
  
    const path = `user/${this.user.uid}`;
  
    try {
      await this.firebaseService.addToSubcollection(path, 'profile', newProfileData);
      console.log('Nuevo perfil creado con éxito.');
      this.profileForm.reset(); 
  
      // Mostrar una alerta que indica que se ha agregado una nueva lista
      const alert = await this.alertController.create({
        header: 'Nuevo perfil creado',
        message: 'Se ha agregado un nuevo perfil nutricional de forma exitosa.',
        buttons: [
          {
            text: 'Aceptar',
            handler: () => {
              this.modalController.dismiss({ listCreated: true });
            }
          }
        ],
      });
  
      await alert.present();
    } catch (error) {
      console.error('Error al crear el perfil:', error);
    }
  }


  //Modal
  dismiss() {
    this.modalController.dismiss();
  }
}