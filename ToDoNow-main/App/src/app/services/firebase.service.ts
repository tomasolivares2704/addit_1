import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user.models';
import { getAuth, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { UtilsService } from './utils.service';
import { Observable } from 'rxjs';
import { Receta } from '../models/receta.models';
import { Foods } from '../models/food.models';
import { myfood } from '../models/myfood.models';
import { List } from '../models/list.models';
import { ActivatedRoute } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private utilsSvc: UtilsService,
    private route: ActivatedRoute
  ) { }

  // Autenticación
  login(user: User) {
    return this.auth.signInWithEmailAndPassword(user.email, user.password);
  }

  signUp(user: User) {
    return this.auth.createUserWithEmailAndPassword(user.email, user.password);
  }

  updateUser(user: any){
    const auth = getAuth();
    return updateProfile(auth.currentUser, user);
  }

  getAuthState() {
    return this.auth.authState;
  }

  async signOut() {
    await this.auth.signOut();
    this.utilsSvc.routerLink('/auth');
    this.utilsSvc.removeElementInLocalStorage('user');
  }

  // Firebase (base de datos)
  getSubcollection(path: string, subcollectionName: string) {
    return this.db.doc(path).collection(subcollectionName).valueChanges({idField: 'id'});
  }

  addToSubcollection(path: string, subcollectionName: string, object: any) {
    return this.db.doc(path).collection(subcollectionName).add(object)
  }

  updateDocument(path: string, object: any){
    return this.db.doc(path).update(object);
  }

  deleteDocument(path: string){
    return this.db.doc(path).delete();
  }

  // Funcion o Metodo para obtener coleccion de Food

  getAllFoods(): Observable<any[]> {
    return this.db.collection('food').valueChanges();
  }

  // Funcion o Metodo para crear un documento en la colección "user" 

  createUserDocument(user: User) {
    return this.db.collection('user').doc(user.uid).set({
      name: user.name,
      email: user.email
      // Aquí puedes agregar más campos si lo necesitas
    });
  }

  getReceta(id: string): Observable<Receta> {
    return this.db.collection('recetas').doc<Receta>(id).valueChanges();
  }

  addReceta(receta: Receta): Promise<void> {
    const id = this.db.createId();
    return this.db.collection('recetas').doc(id).set({ ...receta, id });
  }

  getRecetas(): Observable<any[]> {
    return this.db.collection('recetas').valueChanges({ idField: 'id' });
  }

  async addFoodToCollections(food: Foods): Promise<void> {
    try {
      const currentUser = await this.auth.currentUser;
      if (!currentUser) {
        throw new Error('No se pudo obtener el usuario actual.');
      }
  
      const isAdmin = await this.checkIfUserIsAdmin(currentUser.uid);
  
      if (!isAdmin) {
        throw new Error('El usuario no tiene permisos de administrador.');
      }
  
      const foodId = this.db.createId();
      const foodData = { ...food, id: foodId };
  
      // Agregar el alimento a la colección 'food'
      await this.db.collection('food').doc(foodId).set(foodData);
    } catch (error) {
      throw error;
    }
  }
  
  async checkIfUserIsAdmin(userId: string): Promise<boolean> {
    try {
      const userDoc = await this.db.collection('user').doc(userId).get().toPromise();
      const userData = userDoc.data() as User;
      return userData?.isAdmin || false;
    } catch (error) {
      console.error('Error al verificar si el usuario es administrador:', error);
      return false;
    }
  }

    

  migrateFoodsToMyFoods(user: User) {
    const foodsCollection = this.db.collection('food');
    const myfoodsCollection = this.db.collection(`user/${user.uid}/myfoods`);

    foodsCollection.valueChanges().subscribe((foods: myfood[]) => {
      foods.forEach(food => {
        myfoodsCollection.doc(food.id).set(food);
      });
    });
  }

  observeFoodChangesAndUpdateMyFoods(user: User) {
    const foodsCollection = this.db.collection('food');
    const myfoodsCollection = this.db.collection(`user/${user.uid}/myfoods`);

    // Observar cambios en la colección food
    foodsCollection.snapshotChanges().subscribe(changes => {
      changes.forEach(change => {
        const food = change.payload.doc.data() as myfood;
        const foodId = change.payload.doc.id;
        
        // Actualizar myfoods con el mismo ID que el alimento modificado
        myfoodsCollection.doc(foodId).set(food);
      });
    });
  }

  // Gestión de listas de compras
  createList(list: List) {
    return this.db.collection('list').add(list);
  }

  getLists(): Observable<List[]> {
    return this.db.collection<List>('lists').valueChanges({ idField: 'id' });
  }

  getList(listId: string): Observable<List> {
    return this.db.collection('lists').doc<List>(listId).valueChanges();
  }

  // Notificación
  async showNotification(list: List) {
    const toast = await this.utilsSvc.presentShoppingListNotification(`Reminder for your shopping list: ${list.title}`);
  }

  async checkAndNotifyLists() {
    const listsSnapshot = await this.db.collection<List>('lists').get().toPromise();
    const now = new Date();
    listsSnapshot.forEach(doc => {
      const list = doc.data() as List;
      const nextNotificationDate = new Date(list.createdAt);
      nextNotificationDate.setDate(nextNotificationDate.getDate() + parseInt(list.purchaseFrequency, 10));
      if (nextNotificationDate <= now) {
        this.showNotification(list);
        nextNotificationDate.setDate(nextNotificationDate.getDate() + parseInt(list.purchaseFrequency, 10));
        this.db.collection('lists').doc(doc.id).update({ nextNotification: nextNotificationDate });
      }
    });
  }

  getFoodById(id: string): Observable<Foods> {
    return this.db.collection('food').doc<Foods>(id).valueChanges();
  }

  generateId(): string {
    // Genera un ID único utilizando la función de generación de ID de Firebase
    return this.db.createId();
  }

  addDocument<T>(path: string, data: T): Promise<void> {
    // Añade un nuevo documento a la colección especificada en el path con los datos proporcionados
    return this.db.doc<T>(path).set(data);
  }

  // Fetch all available products
  getAllProducts() {
    return this.db.collection('food').valueChanges();
  }

  getListById(id: string): Observable<List> {
    return this.db.collection('list').doc<List>(id).valueChanges();
  }

//=======AÑADIR PRODUCTOS ========//
addProductsToList(userId: string, listId: string, foods: Foods[]): Promise<void> {
  const listRef = this.db.collection(`user/${userId}/list`).doc(listId);
  
  return listRef.get().toPromise().then(doc => {
    if (doc.exists) {
      const data = doc.data() as List;
      const currentFoods = data.product || [];
      const updatedFoods = [...currentFoods, ...foods];
      return listRef.update({ product: updatedFoods });
    } else {
      return Promise.reject('Document does not exist');
    }
  });
}

//=========== RECUPERAR CONTRASEÑA ===========//

sendRecoveryEmail(email: string) {
  return sendPasswordResetEmail(getAuth(), email)
}

}
