import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {HomePage} from "../home/home";
import { ReportService } from '../../services/report.service';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-reports',
  templateUrl: 'reports.html'
})
export class ReportsPage {

  emergency=false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public reportService : ReportService,
              public alertCtrl:AlertController) {

  }

  emergencyCall(){
    this.emergency = true;
    setTimeout(() => {
      this.emergency = false;
    }, 3000);
  }

  sendReport(type:string){
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        return this.justSendReport({type, gps : {latitude : position.coords.latitude, longitude : position.coords.longitude}})
      });

    } else {
      // geolocation not available
      return this.justSendReport({type, gps : {latitude : 0, longitude : 0}})
    }

  }



  justSendReport(obj){
    this.reportService.send(obj)
      .then(
        (response:any) => {
          const data = response.json();
          this.showOkAlert(data.totalXP, data.gain);

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
