import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user.models';
import { getAuth, updateProfile } from 'firebase/auth';
import { UtilsService } from './utils.service';
import { Observable } from 'rxjs';
import { Receta } from '../models/receta.models';
import { Foods } from '../models/food.models';
import { myfood } from '../models/myfood.models';
import { List } from '../models/list.models';
import { NewList } from '../models/newlist.models';
import {FoodList} from '../models/detnewlist.models';
import { AlimentoListaCompra } from '../models/newlist.models';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private utilsSvc: UtilsService,
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
  

  //Listas de Compras
  getListById(id: string): Observable<List> {
    return this.db.collection('list').doc<List>(id).valueChanges();
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

  addProductsToList(listId: string, foods: Foods[]): Promise<void> {
    const listRef = this.db.collection('list').doc(listId);
    return listRef.get().toPromise().then(doc => {
      if (doc.exists) {
        const data = doc.data() as List;
        const currentFoods = data.food || [];
        const updatedFoods = [...currentFoods, ...foods];
        return listRef.update({ food: updatedFoods });
      } else {
        return Promise.reject('Document does not exist');
      }
    });
  }


  async crearNewList(uid: string, newListData: NewList): Promise<string> {
    try {
      const newListRef = await this.db.collection('user').doc(uid).collection('newlist').add({
        nombre: newListData.nombre,
        total: newListData.total
      });
  
      const newListId = newListRef.id; // Obtener el ID del documento creado
      
      const alimentos = newListData.alimentos.map(alimento => ({
        nombre: alimento.nombre,
        cantidad: alimento.cantidad,
        precio: alimento.precio,
        subtotal: alimento.subtotal
      }));
  
      await Promise.all(alimentos.map(async alimento => {
        await newListRef.collection('alimentos').add(alimento);
      }));
  
      console.log('Nueva lista creada exitosamente.');
      
      return newListId; // Devolver el ID del documento creado
    } catch (error) {
      console.error('Error al crear nueva lista:', error);
      throw error;
    }
  }
  
  
  
  

  // Método para obtener todas las newlist de un usuario
  obtenerNewListDeUsuario(uid: string): Observable<NewList[]> {
    return this.db.collection('user').doc(uid).collection<NewList>('newlist').valueChanges({ idField: 'id' });
  }

  obtenerDetallesLista(uid: string, idLista: string): Observable<NewList> {
    return this.db.collection('user').doc(uid).collection('newlist').doc<NewList>(idLista).valueChanges();
  }



  async actualizarAlimento(userUid: string, listId: string, alimento: AlimentoListaCompra) {
    if (!listId || !alimento.id) {
      console.error('El ID de la lista o el ID del alimento es inválido.');
      console.error('List ID:', listId);
      console.error('Alimento ID:', alimento.id);
      return;
    }
  
    console.log('List ID:', listId);
    console.log('Alimento ID:', alimento.id);
  
    try {
      const alimentosRef = this.db.collection(`user/${userUid}/newlist/${listId}/alimentos`).doc(alimento.id);
      console.log('Alimentos Ref:', alimentosRef);
      await alimentosRef.update(alimento);
      console.log('Alimento actualizado exitosamente en la lista.');
    } catch (error) {
      console.error('Error al actualizar el alimento en la lista:', error);
    }
  }
  
  
  




  
  

  
}
