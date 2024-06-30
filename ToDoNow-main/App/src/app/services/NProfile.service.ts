import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UtilsService } from './utils.service';
import { FirebaseService } from './firebase.service';
import { User } from '../models/user.models';
import { Profile } from '../models/NProfile.models';

@Injectable({
  providedIn: 'root'
})
export class NProfileService {

  private toggleStates = new BehaviorSubject<{ [id: string]: boolean }>({});
  activeProfile: Profile | null = null;

  constructor(
    private utilsService: UtilsService,
    private firebaseService: FirebaseService,
  ) { }

  setToggleState(id: string, state: boolean) {
    const currentStates = this.toggleStates.getValue();
    currentStates[id] = state;
    this.toggleStates.next(currentStates);
  }

  getToggleState(id: string): boolean {
    return this.toggleStates.getValue()[id] || false;
  }

  getToggleStates() {
    return this.toggleStates.asObservable();
  }

  loadActiveProfile() {
    const user: User = this.utilsService.getElementInLocalStorage('user');
    const path = `user/${user.uid}`;

    this.firebaseService.getSubcollection(path, 'profile').subscribe((res: Profile[]) => {
      this.activeProfile = res.find(profile => profile.isActivated) || null;
    });
    console.log(this.activeProfile);
  }

  getActiveProfile(): Profile | null {
    return this.activeProfile;
  }
}