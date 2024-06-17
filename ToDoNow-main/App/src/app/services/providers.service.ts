import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app'; // Importa Firebase compatibilidad


@Injectable({
    providedIn: 'root'
  })
  export class ProvidersService {

    constructor(
        private afAuth: AngularFireAuth,
        private firestore: AngularFirestore
      ) {}
    
      async signInWithGoogle() {
        try {
          const provider = new firebase.auth.GoogleAuthProvider();
          const credential = await this.afAuth.signInWithPopup(provider);
          return credential.user;
        } catch (error) {
          console.error('Error signing in with Google:', error);
          throw error;
        }
      }
    
      async signOut() {
        await this.afAuth.signOut();
      }
    
      getCurrentUser() {
        return this.afAuth.authState;
      }

}