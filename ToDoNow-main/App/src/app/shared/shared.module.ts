import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { CustomInputComponent } from './components/custom-input/custom-input.component';
import { LogoComponent } from './components/logo/logo.component';
/*import { AddUpdateTaskComponent } from './components/add-update-task/add-update-task.component';*/
import { BarraComponent } from './components/barra/barra.component';
import { NotificacionesComponent } from './components/notificaciones/notificaciones.component';

// Import ng-circle-progress
import { NgCircleProgressModule } from 'ng-circle-progress';
import { CreateListModalComponent } from './components/create-list-modal/create-list-modal.component';
import { TabNutriModalComponent } from './components/tab-nutri-modal/tab-nutri-modal.component';
import { ButtonProvidersComponent } from './components/button-providers/button-providers.component';
import { CreateProfileModalComponent } from './components/create-profile-modal/create-profile-modal.component';
import { ChangeEmailModalComponent } from './components/change-email-modal/change-email-modal.component';


@NgModule({
  declarations: [
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    /*AddUpdateTaskComponent,*/
    BarraComponent,
    NotificacionesComponent,
    CreateListModalComponent,
    TabNutriModalComponent,
    ButtonProvidersComponent,
    CreateProfileModalComponent,
    ChangeEmailModalComponent
  ],
  exports: [
    HeaderComponent,
    CustomInputComponent,
    LogoComponent,
    NgCircleProgressModule,
    /*AddUpdateTaskComponent,*/
    BarraComponent,
    NotificacionesComponent,
    CreateListModalComponent,
    TabNutriModalComponent,
    ButtonProvidersComponent,
    CreateProfileModalComponent,
    ChangeEmailModalComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgCircleProgressModule.forRoot({
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    }),
    
    
  ]
})
export class SharedModule { }
