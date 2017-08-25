import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {HomePage} from "../home/home";
import { ReportService } from '../../services/report.service';


@Component({
  selector: 'page-reports',
  templateUrl: 'reports.html'
})
export class ReportsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public reportService : ReportService) {

  }



  sendReport(type:string){
    this.reportService.send(type)
      .then(
        (response) => {
          console.log("done");

        },
        (err) => {
          console.log("failed");

        }
      );
  }

  cancel(){
    this.navCtrl.setRoot(HomePage);
  }

}
