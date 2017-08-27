import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import {HomePage} from "../home/home";
import { ReportService } from '../../services/report.service';
import { AlertController } from 'ionic-angular';
import { ViewChild } from '@angular/core';
import { DomSanitizer, SafeValue } from '@angular/platform-browser'
import {ConfirmPage} from "../payment/confirm";

@Component({
  selector: 'page-reports',
  templateUrl: 'reports.html'
})
export class ReportsPage {

  emergency=false;
  cameraOpen=false;
  photoTaken=false;
  videoSrc:SafeValue;
  type='';
  callNow=false;

  @ViewChild('videoPlayer') videoplayer: any;
  @ViewChild('canvasImg') photo: any;


  toggleVideo() {
    this.videoplayer.nativeElement.play();
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public reportService : ReportService,
              public alertCtrl:AlertController, private _sanitizer: DomSanitizer, private toastCtrl: ToastController) {

      this.presentToast();

  }

  emergencyCall(){
    this.emergency = true;
    this.presentConfirm();
  }


  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Appel d\'urgence',
      message: 'Voulez-vous appeler les secours du festival ?',
      buttons: [
        {
          text: 'Oui, vite ! ',
          role: 'cancel',
          handler: () => {
            this.callNow = true;
            setTimeout(() => {
              this.emergency = false;
              this.callNow = false;
            }, 4000);
          }
        },
        {
          text: 'Nan, ça va en fait. Jme suis trompé :$.',
          handler: () => {
            this.emergency = false;
          }
        }
      ]
    });
    alert.present();
  }


  openCamera(){
    this.cameraOpen = true;
    // Grab elements, create settings, etc.

    const self = this;
    // Get access to the camera!
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
        self.videoplayer.nativeElement.src = window.URL.createObjectURL(stream);
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
            self.navCtrl.setRoot(ConfirmPage);
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
    this.navCtrl.setRoot(ConfirmPage);
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'En exclu : Une toute nouvelle façon de faire grimper la cagnotte !',
      duration: 5000,
      position: 'middle'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

}
