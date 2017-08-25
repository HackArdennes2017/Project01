import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { HomePage } from '../home/home';

import { UserData } from '../../providers/user-data/user-data';

@Component({
  selector: 'page-payment-result',
  templateUrl: 'result.html'
})
export class ResultPage {

  amount:number = 0;
  products = [
    {quantity: 1, label: 'Bière Meteor', amount: 2.5}
  ]
  tipAmount: number = 0;
  total:number = this.totalProducts() + this.tipAmount;
  constructor(public navCtrl: NavController, public navParams: NavParams, private userData:UserData) {
    this.userData.getAmount().then(amount => this.amount = amount);
    this.tipAmount = parseFloat(navParams.get("tipAmount"));
  }

  totalProducts() {
    return this.products.reduce((a,b) => a + b.amount, 0);
  }

  validate(){
    this.navCtrl.setRoot(HomePage);
  }

}
