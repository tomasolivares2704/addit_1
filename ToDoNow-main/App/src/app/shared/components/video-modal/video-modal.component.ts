import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-video-modal',
  templateUrl: './video-modal.component.html',
  styleUrls: ['./video-modal.component.scss'],
})
export class VideoModalComponent {
  @Input() videoUrl: string;
  safeVideoUrl: SafeResourceUrl;

  constructor(
    private sanitizer: DomSanitizer,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.safeVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.videoUrl);
  }

  dismiss() {
    this.modalController.dismiss();
  }
}
