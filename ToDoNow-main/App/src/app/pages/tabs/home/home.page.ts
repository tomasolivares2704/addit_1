import { Component, OnInit } from '@angular/core';
import { User } from 'firebase/auth';
import { Task } from 'src/app/models/task.models';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateTaskComponent } from 'src/app/shared/components/add-update-task/add-update-task.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  tasks: Task[] = [];
  user = {} as User;
  loading: boolean = false;

  constructor(
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService,
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getTasks()
    this.getUser()
  }

  getUser() {
    return this.user = this.utilsSvc.getElementInLocalStorage('user');
  }

  getPercentage(task: Task){
    return this.utilsSvc.getPercentage(task);
  }

  async addOrUpdateTask(task?: Task){
    let res = await this.utilsSvc.presentModal({
      component: AddUpdateTaskComponent,
      componentProps: { task },
      cssClass: 'add-update-modal'
    });

    if(res && res.success) {
      this.getTasks();
    }
  }

  getTasks(){
    let user: User = this.utilsSvc.getElementInLocalStorage('user')
    let path = `users/${user.uid}`;
    this.loading = true;

    let sub = this.firebaseSvc.getSubcollection(path, 'tasks').subscribe({
      next: (res: Task[]) => {
        console.log(res);
        this.tasks = res
        sub.unsubscribe()
        this.loading = false;
      }
    })
  }

  deleteTask(task: Task){
    let path = `users/${this.user.uid}/tasks/${task.id}`;

    this.utilsSvc.presentLoading();

    this.firebaseSvc.deleteDocument(path).then(res => {

    this.utilsSvc.presentToast({
      message: 'Tarea eliminada exitosamente',
      color: 'success',
      icon: 'checkmark-circle-outline',
      duration: 1500
    });

    this.getTasks();
    this.utilsSvc.dismissLoading();

    }, error => {
      this.utilsSvc.presentToast({
        message: error,
        color: 'warning',
        icon: 'alert-circle-outline',
        duration: 5000
      });
  
      this.utilsSvc.dismissLoading();

    });
  }

  confirmDeleteTask(task: Task){ {
    this.utilsSvc.presentAlert({
      header: 'Eliminar tarea',
      message: '¿Quieres eliminar esta tarea?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        }, {
          text: 'Si, eliminar',
          handler: () => {
            this.deleteTask(task);
          }
        }]
      });
    }
  }
}
