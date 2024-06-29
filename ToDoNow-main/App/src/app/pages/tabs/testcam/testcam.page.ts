import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-testcam',
  templateUrl: './testcam.page.html',
  styleUrls: ['./testcam.page.scss'],
})
export class TestcamPage {
  @ViewChild('videoElement', { static: false }) videoElement: ElementRef;
  @ViewChild('canvasElement', { static: false }) canvasElement: ElementRef;

  fotoCapturada: string;

  constructor() {}

  async activarCamara() {
    try {
      const video = this.videoElement.nativeElement;
      const constraints = { video: true };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = stream;
    } catch (error) {
      console.error('Error al acceder a la cámara:', error);
    }
  }

  tomarFoto() {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convertir la imagen del canvas a Base64
    this.fotoCapturada = canvas.toDataURL('image/png');
    
    // Detener la reproducción del video
    video.srcObject.getVideoTracks().forEach(track => track.stop());
  }
}
