import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ConfirmPage } from './confirm';


@Component({
  selector: 'page-payment-scan',
  templateUrl: 'scan.html'
})
export class ScanPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    setTimeout(() => {
      this.navCtrl.push(ConfirmPage);
    }, 5000);
  }

}
