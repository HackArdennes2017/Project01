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
  products = [
    {quantity: 1, label: 'Bière Meteor', amount: 2.5}
  ]
  tipAmount: number = 0.5;
  total:number = this.totalProducts() + this.tipAmount;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userData:UserData) {
    userData.getAmount().then(amount => this.amount = amount);
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
    this.userData.setAmount(this.amount - (this.totalProducts() + this.tipAmount));
    this.navCtrl.push(ResultPage,{
      tipAmount: this.tipAmount
    });
  }

}
