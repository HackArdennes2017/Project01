import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {HomePage} from "../home/home";
import { ReportService } from '../../services/report.service';
import { AlertController } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'

@Component({
  selector: 'page-reports',
  templateUrl: 'reports.html'
})
export class ReportsPage {

  emergency=false;
  cameraOpen=false;
  photoTaken=false;
  videoSrc:any='';
  type='';

  @ViewChild('videoPlayer') videoplayer: any;
  @ViewChild('canvasImg') photo: any;


  toggleVideo() {
    this.videoplayer.nativeElement.play();
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public reportService : ReportService,
              public alertCtrl:AlertController, private _sanitizer: DomSanitizer) {

  }

  emergencyCall(){
    this.emergency = true;
    setTimeout(() => {
      this.emergency = false;
    }, 3000);
  }

  openCamera(){
    this.cameraOpen = true;
    // Grab elements, create settings, etc.

    const self = this;
    // Get access to the camera!
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Not adding `{ audio: true }` since we only want video now
      navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        self.videoSrc = self._sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(stream));
        self.toggleVideo();
      });
    }
  }

  snap(){
    this.photoTaken = true;

    let context:any = this.photo.nativeElement.getContext('2d');

    context.drawImage(this.videoplayer.nativeElement, 0, 0, 640, 480);
  }


  prepareReport(type:string){
    this.type = type;
    this.openCamera();
  }

  sendReport(){
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        return this.justSendReport({type : this.type, gps : {latitude : position.coords.latitude, longitude : position.coords.longitude}})
      });

    } else {
      // geolocation not available
      return this.justSendReport({type : this.type, gps : {latitude : 0, longitude : 0}})
    }
  }



  justSendReport(obj){
    const self = this;
    this.reportService.send(obj)
      .then(
        (response:any) => {
          const data = response.json();
          this.showOkAlert(data.totalXP, data.gain);
          setTimeout(() => {
            self.navCtrl.setRoot(HomePage);
          }, 5000);
        },
        (err) => {
          console.log("failed");
          this.showErrorAlert();
        }
      );
  }


  showOkAlert(totalXP, gain) {
    let alert = this.alertCtrl.create({
      title: 'Merci pour votre retour!',
      subTitle: 'Nous allons régler le problème au plus vite! Votre implication vous rapporte ' + gain + ' points ! Bravo, vous disposez de ' + totalXP + ' points !',
      buttons: ['OK']
    });
    alert.present();
  }

  showErrorAlert() {
    let alert = this.alertCtrl.create({
      title: 'Zut, ça n\'a pas marché !',
      subTitle: 'Retentez votre chance :/',
      buttons: ['OK']
    });
    alert.present();
  }

  cancel(){
    this.navCtrl.setRoot(HomePage);
  }

}
