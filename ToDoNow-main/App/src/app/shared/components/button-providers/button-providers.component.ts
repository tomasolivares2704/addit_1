import { Component, OnInit } from '@angular/core';
import { ProvidersService } from 'src/app/services/providers.service';

export type Provider = 'facebook' | 'google'

@Component({
  selector: 'app-button-providers',
  templateUrl: './button-providers.component.html',
  styleUrls: ['./button-providers.component.scss'],
})
export class ButtonProvidersComponent  implements OnInit {


  constructor(
    private providers: ProvidersService,
  ) { }

  ngOnInit() {}

  async loginWithGoogle() {
    try {
      const user = await this.providers.signInWithGoogle();
      console.log('Logged in user:', user);
      // Redirigir al usuario a otra página si es necesario
    } catch (error) {
      console.error('Error logging in with Google:', error);
    }
  }

  async signUpWithFacebook() {
    /*try {
      const result = await this.firebaseService.SignWithFacebookProvider();
      this.router.navigateByUrl('/')
      console.log(result);
    } catch (error) {
      console.log(error);
    }*/
  }
}
