import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Receta } from 'src/app/models/receta.models';



@Component({
  selector: 'app-recetas',
  templateUrl: './recetas.page.html',
  styleUrls: ['./recetas.page.scss'],
})
export class RecetasPage implements OnInit {

  newRecetaForm: FormGroup;
  loading: boolean = false;
  recetas: Receta[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService

  ) {

    this.newRecetaForm = this.formBuilder.group({
      name: ['', Validators.required],
      imagen: ['', Validators.required],
      calories: ['', Validators.required],
      protein: ['', Validators.required],
      fats: ['', Validators.required],
      carbohydrates: ['', Validators.required],
      ingredients: this.formBuilder.array([])
    });

   }

   ngOnInit() {
    this.getRecetas();
    this.addIngredient(); // Inicialmente añade un ingrediente vacío
  }

  get ingredients(): FormArray {
    return this.newRecetaForm.get('ingredients') as FormArray;
  }

  addIngredient() {
    const ingredientForm = this.formBuilder.group({
      name: ['', Validators.required],
      stock: ['', Validators.required]
    });
    this.ingredients.push(ingredientForm);
  }

  removeIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  addNewReceta() {
    const newRecetaData = this.newRecetaForm.value as Receta;
    this.loading = true;
  
    this.firebaseSvc.addReceta(newRecetaData).then(() => {
      this.newRecetaForm.reset();
      this.loading = false;
    }).catch(error => {
      this.loading = false;
      console.error('Error al agregar receta:', error);
    });
  }
  

  getRecetas() {
    this.loading = true;
  
    this.firebaseSvc.getRecetas().subscribe(recetas => {
      this.recetas = recetas;
      this.loading = false;
      console.log('Recetas recibidas:', recetas);
    }, error => {
      console.error('Error al obtener recetas:', error);
      this.loading = false;
    });
  }
  

  

}
