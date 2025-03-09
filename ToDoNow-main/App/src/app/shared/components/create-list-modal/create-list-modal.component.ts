import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Modelos
import { NewList, AlimentoListaCompra } from 'src/app/models/newlist.models'; // Asegúrate de importar correctamente los modelos
import { User } from 'src/app/models/user.models';

@Component({
  selector: 'app-create-list-modal',
  templateUrl: './create-list-modal.component.html',
  styleUrls: ['./create-list-modal.component.scss'],
})
export class CreateListModalComponent implements OnInit {

  newListForm: FormGroup;
  user = {} as User;
  alimentos: AlimentoListaCompra[] = []; // Array para almacenar los alimentos seleccionados

  frecuenciasCompra = ['Diaria', 'Semanal', 'Quincenal', 'Mensual'];

  constructor(
    private modalController: ModalController,
    private firebaseService: FirebaseService,
    private utilsService: UtilsService,
    private formBuilder: FormBuilder,
    private alertController: AlertController,
  ) {}

  ngOnInit() {
    this.getUser();
    this.initForm();
    this.getAllFoods();
  }

  getUser() {
    // Implementación para obtener el usuario según tu lógica
    this.user = this.utilsService.getElementInLocalStorage('user');
  }
  
  initForm() {
    this.newListForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      frecuenciaCompra: ['', Validators.required],
    });
  }

  getAllFoods() {
    this.firebaseService.getAllFoods().subscribe(
      (foods: any[]) => {
        this.alimentos = foods.map((food, index) => ({
          id: food.id || `food_${index}`,
          nombre: food.name,
          imagen: food.imagen || '',
          cantidad: 0,
          precio: food.price,
          precio2: food.price2,
          subtotal: 0,
          subtotal2: 0,
          precioSeleccionado: 0,
        }));
      },
      (error) => {
        console.error('Error al obtener alimentos:', error);
      }
    );
  }

  async crearNuevaLista() {
    if (this.newListForm.valid && this.user.uid) {
      const newListData: NewList = {
        id: '', // Se asignará automáticamente por Firestore
        nombre: this.newListForm.value.nombre,
        total: 0, // Calculado según sea necesario
        total2: 0, // Calculado según sea necesario
        alimentos: this.alimentos, // Asignar el array de alimentos
        frecuenciaCompra: this.newListForm.value.frecuenciaCompra,
      };

      try {
        const newListId = await this.firebaseService.crearNewList(this.user.uid, newListData);
        newListData.id = newListId;
        console.log('Nueva lista creada exitosamente:', newListData);
        this.dismiss(true); // Cerrar modal y pasar true si se creó la lista correctamente
      } catch (error) {
        console.error('Error al crear nueva lista:', error);
        // Manejo de errores si es necesario
      }
    } else {
      console.error('El formulario no es válido o falta el UID del usuario.');
    }
  }

  async dismiss(listCreated: boolean = false) {
    await this.modalController.dismiss({ listCreated });
  }

}