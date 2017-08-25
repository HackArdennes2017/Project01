import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ResultPage } from './result';
import { HomePage } from '../home/home';

import { UserData } from '../../providers/user-data/user-data';

@Component({
  selector: 'page-payment-confirm',
  templateUrl: 'confirm.html'
})
export class ConfirmPage {

  anim:boolean = false;
  amount:number = 0;
  products = [];
  tipAmount: number = 0.5;
  total:number = this.totalProducts() + this.tipAmount;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userData:UserData) {
    // Get user amount
    userData.getAmount().then(amount => this.amount = amount);
    // Product from QR code
    this.products.push({
      quantity: parseInt(navParams.get("productCount")),
      label: navParams.get("productLabel"),
      amount: parseFloat(navParams.get("productAmount")),
    });
  }

  decrease(){
    if(this.tipAmount>=0.1)
      this.tipAmount = Math.round( (this.tipAmount - 0.1) * 10) / 10;
    this.total = this.totalProducts() + this.tipAmount;
  }

  increase(){
    this.tipAmount = Math.round( (this.tipAmount + 0.1) * 10) / 10;
    this.total = this.totalProducts() + this.tipAmount;
  }

  rendsLargent(){
    this.anim = true;
    setTimeout(() => {
      this.anim = false;
    }, 3000);
    this.tipAmount = 0;
    this.total = this.totalProducts() + this.tipAmount;
  }

  totalProducts() {
    return this.products.reduce((a,b) => a + b.amount, 0);
  }

  cancel(){
    this.navCtrl.setRoot(HomePage);
  }

  validate(){
    // Decrease local user account
    this.userData.setAmount(this.amount - (this.totalProducts() + this.tipAmount));
    // Go to result page
    this.navCtrl.push(ResultPage,{
      tipAmount: this.tipAmount,
      productCount: this.products[0].quantity,
      productLabel: this.products[0].label,
      productAmount: this.products[0].amount
    });
  }

}
