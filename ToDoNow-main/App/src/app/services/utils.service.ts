/**
 * Servicio de utilidades que proporciona funciones para mostrar cargas, alertas, modales, notificaciones, y gestionar el almacenamiento local y la navegación.
 */

/**
 * Importa las clases y opciones necesarias para la gestión de alertas, cargas, modales y toasts en una aplicación Ionic.
 * También importa el enrutador de Angular y el modelo de datos de una tarea.
 */
import { Injectable } from '@angular/core';
import { AlertController, AlertOptions, LoadingController, LoadingOptions, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';
import { Router } from '@angular/router';
import { Task } from 'src/app/models/task.models';



@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private loadingController: LoadingController,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController,
    private modalController: ModalController
  ) { }


/**
 * Función asincrónica para presentar una carga con las opciones especificadas.
 * 
 * @param opts Opciones de la carga a presentar.
 */
async presentLoading(opts?: LoadingOptions) {
  const loading = await this.loadingController.create(opts);
  await loading.present();
}

/**
* Función asincrónica para descartar la carga actual.
*/
async dismissLoading() {
  return await this.loadingController.dismiss();
}


  // LocalStorage
  setElementInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  getElementInLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  removeElementInLocalStorage(key: string) {
    localStorage.removeItem(key);
  }

  async presentToast(opts: ToastOptions) {
    const toast = await this.toastController.create(opts);
    toast.present();
  }

  // Router
  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  // Alert
  async presentAlert(opts: AlertOptions) {
    const alert = await this.alertController.create(opts);
    await alert.present();
  }

  // Modal Present
  async presentModal(opts: ModalOptions) {
    const modal = await this.modalController.create(opts);
    await modal.present();

    const {data} = await modal.onWillDismiss();
    
    if(data){
      return data;
    }
  }

  async dismissToast() {
    await this.toastController.dismiss();
  }


  // Dismiss
  dismssModal(data?: any) {
    this.modalController.dismiss(data);
  }

  getPercentage(task: Task){
    let completeItems = task.items.filter(item => item.completed).length;
    let totalItems = task.items.length;
    let percentage = (100/totalItems) * completeItems;

    return parseInt(percentage.toString());
  }

  // Notificación específica para listas de compras
  async presentShoppingListNotification(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

}