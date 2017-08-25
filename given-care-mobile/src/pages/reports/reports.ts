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

  constructor(public navCtrl: NavController, public navParams: NavParams, public reportService : ReportService,
              public alertCtrl:AlertController) {

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
        (response) => {
          console.log("done");
          this.showOkAlert();

        },
        (err) => {
          console.log("failed");
          this.showErrorAlert();
        }
      );
  }


  showOkAlert() {
    let alert = this.alertCtrl.create({
      title: 'Merci pour votre retour!',
      subTitle: 'Nous allons régler le problème au plus vite! Merci encore pour votre implication',
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
