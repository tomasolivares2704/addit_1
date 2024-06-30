import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { BrowserBarcodeReader, Result } from '@zxing/library';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { myfood } from 'src/app/models/myfood.models';
import { User } from 'src/app/models/user.models';
import { Foods } from 'src/app/models/food.models';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {

  myfoods: myfood[] = [];           // Lista de alimentos del usuario
  filteredFoods: myfood[] = [];     // Alimentos filtrados por término de búsqueda
  loading: boolean = false;         // Indicador de carga
  user = {} as User;                // Usuario actual
  newFoodForm: FormGroup;           // Formulario Reactivo para agregar nuevos alimentos
  addMode: boolean = true;          // Modo de agregar o editar alimentos
  searchTerm: string = '';          // Término de búsqueda para filtrar alimentos
  stockIdealToShow: number;         // Valor del stock ideal a mostrar en el formulario

  @ViewChild('videoElement', { static: false }) videoElement: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement', { static: false }) canvasElement: ElementRef<HTMLCanvasElement>;
  codeReader: BrowserBarcodeReader;
  showScanner: boolean = false; 

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
    private formBuilder: FormBuilder,
    private auth: AngularFireAuth,
    private db: AngularFirestore,
  ) {
    // Inicialización del formulario reactivo para agregar nuevos alimentos
    this.newFoodForm = this.formBuilder.group({
      name: ['', Validators.required],
      imagen: ['', Validators.required]
    });

    this.codeReader = new BrowserBarcodeReader();

  }

  ngOnInit() {
    this.getUser();                         // Obtiene el usuario actual
    this.getMyFoods();                      // Obtiene los alimentos del usuario
    this.observeFoodChangesAndUpdateMyFoods();  // Observa cambios en los alimentos
  }

  // Función para obtener el usuario desde el almacenamiento local
  getUser() {
    this.user = this.utilsSvc.getElementInLocalStorage('user');
    console.log('ID DEL USUARIO:', this.user.uid);
  }

  // Función para obtener los alimentos del usuario
getMyFoods() {
  let user: User = this.utilsSvc.getElementInLocalStorage('user');
let path = `user/${user.uid}`; // Corregir el path para apuntar directamente a la subcolección myfoods
this.loading = true;

// Llamada al método getSubcollection1 con los dos argumentos necesarios
this.firebaseSvc.getSubcollection1(path, 'myfoods').subscribe({
  next: (myfoods: myfood[]) => {
    if (myfoods.length === 0) {
      // Si no hay documentos en myfoods, replicar desde la colección food
      this.replicateFoodToMyFoods(user.uid);
    } else {
      // Si hay documentos, usar los alimentos obtenidos
      this.myfoods = myfoods.map(food => ({
        ...food,
        showStockEditor: false,
        showIdealStockEditor: false
      }));
      this.filteredFoods = this.myfoods;
      this.loading = false;
      this.applyStockColors();
      this.utilsSvc.setElementInLocalStorage('myfoods', this.myfoods);
    }
  },
  error: (error) => {
    console.error('Error al obtener alimentos:', error);
    this.loading = false;
  }
});


}

// Método para replicar documentos desde food a myfoods
replicateFoodToMyFoods(userId: string): Promise<void> {
  const batch = this.db.firestore.batch();
  const foodsCollection = this.db.collection('food').ref; // Referencia a la colección 'foods'
  const myfoodsCollection = this.db.collection(`user/${userId}/myfoods`).ref; // Referencia a la subcolección 'myfoods'

  return foodsCollection.get().then(snapshot => {
    snapshot.forEach(doc => {
      const food = doc.data() as Foods;
      const newFood: myfood = {
        id: doc.id,
        name: food.name,
        imagen: food.imagen,
        stock: 1,
        stock_ideal: 1,
        showStockEditor: false,
        showIdealStockEditor: false,
        activo: true,
        codigoBarras: food.codigoBarras ? food.codigoBarras : 'aaaa111',
      };
      const docRef = myfoodsCollection.doc(doc.id); // Referencia correcta al documento en 'myfoods'
      batch.set(docRef, newFood);
    });

    return batch.commit().then(() => {
      console.log('Replicación completada correctamente');
    }).catch(error => {
      console.error('Error al replicar alimentos:', error);
    });
  });
}


  

 

  // Función para observar cambios en los alimentos y actualizar
  observeFoodChangesAndUpdateMyFoods() {
    let user: User = this.utilsSvc.getElementInLocalStorage('user');
    this.firebaseSvc.observeFoodChangesAndUpdateMyFoods(user);
  }

  // Función para cambiar entre modo de agregar y editar alimentos
  toggleMode(event: any) {
    this.addMode = event.detail.checked;
  }

  // Función para aplicar colores según el nivel de stock
  applyStockColors() {
    if (!this.myfoods || this.myfoods.length === 0) return;

    for (const food of this.myfoods) {
      const porcentajeStock = (food.stock / food.stock_ideal) * 100;

      if (porcentajeStock >= 100) {
        food.bgColor = 'green';   // Stock igual o mayor al 100% del ideal
      } else if (porcentajeStock >= 50) {
        food.bgColor = 'yellow';  // Stock entre el 50% y 99% del ideal
      } else if (porcentajeStock >= 20) {
        food.bgColor = 'orange';  // Stock entre el 20% y 49% del ideal
      } else {
        food.bgColor = 'red';     // Stock menor al 20% del ideal
      }
    }
  }

  // Función para mostrar el editor de stock de un alimento
  showStockEditor(food: myfood) {
    food.showStockEditor = true;
  }

  // Función para incrementar el stock de un alimento
  incrementStock(food: myfood) {
    food.stock++;
    food.stockToShow = food.stock;
  }

  // Función para decrementar el stock de un alimento
  decrementStock(food: myfood) {
    if (food.stock > 0) {
      food.stock--;
      food.stockToShow = food.stock;
    }
  }

  // Función para confirmar el cambio de stock de un alimento
  confirmStockChange(food: myfood) {
    food.stock = food.stockToShow;
    this.updateStock(food);   // Llama a la función para actualizar en Firebase
  }

  // Función para actualizar el stock de un alimento en Firebase
  updateStock(food: myfood) {
    let user: User = this.utilsSvc.getElementInLocalStorage('user');
    let path = `user/${user.uid}/myfoods/${food.id}`;
    this.loading = true;

    const updateObject: Partial<myfood> = {};
    if (food.stock !== undefined) {
      updateObject.stock = food.stock;
    }

    this.firebaseSvc.updateDocument(path, updateObject)
      .then(() => {
        console.log('Cantidad de stock actualizada exitosamente');
        this.loading = false;
      })
      .catch(error => {
        console.error('Error al actualizar cantidad de stock:', error);
        this.loading = false;
      });
  }

  // Función para cancelar la edición del stock de un alimento
  cancelStockEdit(food: myfood) {
    food.stockToShow = food.stock;
    food.showStockEditor = false;
  }

  // Función para filtrar alimentos según un término de búsqueda
  filterFoods(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredFoods = this.myfoods.filter(food => {
      return food.name.toLowerCase().includes(searchTerm);
    });
  }

  // Función para abrir un modal de filtros (puedes agregar funcionalidad adicional aquí)
  openFilterModal() {
    console.log('Abriendo modal de filtros');
    // Lógica para abrir un modal de filtros si es necesario
  }

  // Función para mostrar el editor de stock ideal de un alimento
  showIdealStockEditor(food: myfood) {
    food.showIdealStockEditor = true;
    this.stockIdealToShow = food.stock_ideal;
  }

  // Función para confirmar el cambio de stock ideal de un alimento
  submitIdealStock(food: myfood) {
    let user: User = this.utilsSvc.getElementInLocalStorage('user');
    let path = `user/${user.uid}/myfoods/${food.id}`;
    this.loading = true;
    this.firebaseSvc.updateDocument(path, { stock_ideal: food.stock_ideal })
      .then(() => {
        console.log('Stock ideal actualizado exitosamente');
        this.loading = false;
        food.showIdealStockEditor = false; // Oculta el editor de stock ideal después de actualizar
      })
      .catch(error => {
        console.error('Error al actualizar stock ideal:', error);
        this.loading = false;
      });
  }

  // Función para cancelar la edición del stock ideal de un alimento
  cancelIdealStockEdit(food: myfood) {
    food.showIdealStockEditor = false;
  }

  // Función para incrementar el stock ideal de un alimento
  incrementStockIdeal(food: myfood) {
    food.stock_ideal++;
  }

  // Función para decrementar el stock ideal de un alimento
  decrementStockIdeal(food: myfood) {
    if (food.stock_ideal > 0) {
      food.stock_ideal--;
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

  async startScanner() {
    try {
      await new Promise(resolve => setTimeout(resolve, 100)); // Asegura que el DOM esté completamente cargado
  
      if (this.videoElement && this.videoElement.nativeElement) {
        const result: Result = await this.codeReader.decodeOnceFromVideoDevice(undefined, this.videoElement.nativeElement);
  
        if (result) {
          console.log('Código de barras escaneado:', result.getText());
          this.showStockEditorIfFound(result.getText()); // Llama a la función para mostrar el editor si se encuentra el código
        } else {
          console.log('No se pudo escanear ningún código de barras.');
        }
      } else {
        console.error('Elemento de video no encontrado en el DOM.');
      }
    } catch (error) {
      console.error('Error al escanear código de barras:', error);
    } finally {
      this.showScanner = false; // Cierra el div de la cámara después de escanear
    }
  }
  

  // Función para mostrar el editor de stock si se encuentra el código en myfoods
  showStockEditorIfFound(code: string) {
    const foundFood = this.myfoods.find(food => food.codigoBarras === code);
    if (foundFood) {
      this.showStockEditor(foundFood);
    }
  }
  

  scanAndSearchInMyFoods() {
    this.showScanner = true; // Mostrar el scanner al hacer clic en el botón
    this.startScanner();
  }

  
  
  
}
