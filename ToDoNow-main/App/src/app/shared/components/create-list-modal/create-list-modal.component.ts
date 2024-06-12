import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

//Modelos
import { List } from 'src/app/models/list.models';
import { User } from 'src/app/models/user.models';

@Component({
  selector: 'app-create-list-modal',
  templateUrl: './create-list-modal.component.html',
  styleUrls: ['./create-list-modal.component.scss'],
})
export class CreateListModalComponent implements OnInit {

  listForm: FormGroup;

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
    this.listForm = this.formBuilder.group({
      title: ['', Validators.required],
      image: ['', Validators.required],
      purchaseFrequency: ['', Validators.required],
    });
  }

  //Crear una nueva lista
  async createNewList() {
    const newListData: List = {
      id: this.firebaseService.generateId(), // Asegúrate de tener una manera de generar un ID único para la lista
      title: this.listForm.value.title,
      image: this.listForm.value.image?.toString() || '',
      purchaseFrequency: this.listForm.value.purchaseFrequency.toString(),
      createdAt: new Date(),
      product: [] // Inicializa el array de productos vacío
    };
  
    const path = `user/${this.user.uid}`;
  
    try {
      await this.firebaseService.addToSubcollection(path, 'list', newListData);
      console.log('Nueva lista añadida correctamente.');
      this.listForm.reset(); // Limpiar el formulario después de agregar la nueva lista
  
      // Mostrar una alerta que indica que se ha agregado una nueva lista
      const alert = await this.alertController.create({
        header: 'Nueva lista creada',
        message: 'Se ha agregado una nueva lista de forma exitosa.',
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
      console.error('Error al añadir la nueva lista:', error);
      // Manejo de errores si es necesario
    }
  }


  //Modal
  dismiss() {
    this.modalController.dismiss();
  }
}
