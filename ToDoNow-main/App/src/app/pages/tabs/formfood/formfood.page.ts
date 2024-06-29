import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BrowserBarcodeReader, Result } from '@zxing/library';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Foods, CategoriaAlimento } from 'src/app/models/food.models';
import { User } from 'src/app/models/user.models';

@Component({
  selector: 'app-formfood',
  templateUrl: './formfood.page.html',
  styleUrls: ['./formfood.page.scss'],
})
export class FormfoodPage implements OnInit {

  @ViewChild('videoElement', { static: false }) videoElement: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement', { static: false }) canvasElement: ElementRef<HTMLCanvasElement>;
  newFoodForm: FormGroup;
  loading: boolean = false;
  categorias: string[];
  foods: Foods[] = [];
  codeReader: BrowserBarcodeReader;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private renderer: Renderer2
  ) {
    this.newFoodForm = this.formBuilder.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      price2: ['', Validators.required],
      calories: ['', Validators.required],
      categoria: [CategoriaAlimento.Verduras, Validators.required],
      imagen: ['', Validators.required],
      fat: ['', Validators.required],
      fat_sat: ['', Validators.required],
      fat_trans: ['', Validators.required],
      sodio: ['', Validators.required],
      carbs: ['', Validators.required],
      protein: ['', Validators.required],
      colesterol: ['', Validators.required],
      fibra: ['', Validators.required],
      medida: ['', Validators.required],
      codigoBarras: ['', Validators.required]
    });

    this.categorias = Object.values(CategoriaAlimento);
    this.codeReader = new BrowserBarcodeReader();
  }

  ngOnInit() {
    this.getAllFoods();
  }

  getAllFoods() {
    this.loading = true;
    this.firebaseSvc.getAllFoods().subscribe(foods => {
      this.foods = foods;
      this.loading = false;
    });
  }

  addNewFood() {
    if (this.newFoodForm.valid) {
      const newFoodData: Foods = {
        ...this.newFoodForm.value,
        id: ''
      };

      this.loading = true;
      this.firebaseSvc.addFoodToCollections(newFoodData).then(() => {
        this.newFoodForm.reset();
        this.loading = false;
      }).catch(error => {
        console.error('Error al agregar alimento:', error);
        this.loading = false;
      });
    } else {
      console.error('Formulario no válido');
    }
  }

  async scanBarcode() {
    try {
      if (this.videoElement && this.videoElement.nativeElement) {
        const result: Result = await this.codeReader.decodeOnceFromVideoDevice(undefined, this.videoElement.nativeElement);

        if (result) {
          console.log('Código de barras escaneado:', result.getText());
          this.newFoodForm.patchValue({ codigoBarras: result.getText() });
        } else {
          console.log('No se pudo escanear ningún código de barras.');
        }
      } else {
        console.error('Elemento de video no encontrado en el DOM.');
      }
    } catch (error) {
      console.error('Error al escanear código de barras:', error);
    }
  }
}
