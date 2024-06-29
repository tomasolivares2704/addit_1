import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BrowserBarcodeReader, Result } from '@zxing/library';

@Component({
  selector: 'app-testcam',
  templateUrl: './testcam.page.html',
  styleUrls: ['./testcam.page.scss'],
})
export class TestcamPage implements OnInit {
  @ViewChild('video', { static: false }) video: ElementRef<HTMLVideoElement>;
  codeReader: BrowserBarcodeReader;
  isCameraOn = false;
  isScanning = false;
  scanAttempts = 0;
  maxScanAttempts = 5; // Máximo número de intentos de escaneo
  scanTimeout = 5000; // Tiempo máximo de espera por intento de escaneo (en milisegundos)
  scanInterval: any; // Variable para el intervalo de escaneo

  constructor() {
    this.codeReader = new BrowserBarcodeReader();
  }

  ngOnInit() {
  }

  async toggleCamera() {
    try {
      if (!this.isCameraOn) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        const videoElement = this.video?.nativeElement;
        if (videoElement) {
          videoElement.srcObject = stream;
          await videoElement.play();
          this.isCameraOn = true;
        } else {
          console.error('Elemento de video no encontrado en el DOM.');
        }
      } else {
        const videoElement = this.video?.nativeElement;
        if (videoElement && videoElement.srcObject) {
          const stream = videoElement.srcObject as MediaStream;
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop());
          videoElement.srcObject = null;
          this.isCameraOn = false;
        }
      }
    } catch (error) {
      console.error('Error al activar/desactivar la cámara:', error);
    }
  }

  async startScanner() {
    if (this.isScanning) return; // Evitar iniciar múltiples escaneos simultáneos
    this.isScanning = true;
    this.scanAttempts = 0;

    try {
      await this.delay(500); // Esperar un breve momento para asegurar que el video esté listo

      const videoElement = this.video?.nativeElement;
      if (!videoElement) {
        console.error('Elemento de video no encontrado en el DOM.');
        return;
      }

      let result: Result | undefined;
      do {
        result = await this.codeReader.decodeFromVideoElement(videoElement);
        this.scanAttempts++;
      } while (!result && this.scanAttempts < this.maxScanAttempts);

      if (result) {
        console.log('Código de barras escaneado:', result.getText());
        // Mostrar mensaje por consola al reconocer el código de barras
        console.log('Se ha reconocido un código de barras:', result.getText());
      } else {
        console.log('No se pudo escanear ningún código de barras después de varios intentos.');
      }
    } catch (error) {
      console.error('Error al escanear código de barras:', error);
    } finally {
      this.isScanning = false;
    }
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
