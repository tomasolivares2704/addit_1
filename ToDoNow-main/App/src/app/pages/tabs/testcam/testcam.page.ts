import { Component, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';

const { Camera } = Plugins; // Accedemos al plugin Camera

@Component({
  selector: 'app-testcam',
  templateUrl: './testcam.page.html',
  styleUrls: ['./testcam.page.scss'],
})
export class TestcamPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  async takePicture() {
    try {
      const capturedPhoto = await Camera['getPhoto']({
        quality: 90,
        allowEditing: false,
        resultType: 'uri', // Utiliza 'uri' en lugar de CameraResultType.Uri
        source: 'camera', // Utiliza 'camera' en lugar de CameraSource.Camera
      });
      

      console.log('Foto capturada:', capturedPhoto);

    } catch (error) {
      console.error('Error capturando foto:', error);
    }
  }
}
