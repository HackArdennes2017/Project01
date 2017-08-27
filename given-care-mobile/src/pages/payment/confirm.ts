import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';

import { ResultPage } from './result';
import { HomePage } from '../home/home';

import { UserData } from '../../providers/user-data/user-data';

import { ProductService } from '../../services/product.service';

@Component({
  selector: 'page-payment-confirm',
  templateUrl: 'confirm.html'
})
export class ConfirmPage {

  anim:boolean = false;
  amount:number = 0;
  products = [];
  tipAmount: number = 0.5;
  total:number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams, private userData:UserData, private productService:ProductService, private toastCtrl: ToastController) {
    // Get user amount
    userData.getAmount().then(amount => this.amount = amount);
    // Product from QR code
    // this.products.push({
    //   quantity: parseInt(navParams.get("productCount")),
    //   label: navParams.get("productLabel"),
    //   amount: parseFloat(navParams.get("productAmount")),
    //   id: navParams.get("productId")
    // });
  }

  ngOnInit() {
    this.productService.getProducts().subscribe((products) => {
      // Get a random product
      if(products && products.json() && products.json().length > 0){
        const product = products.json()[Math.floor(Math.random()*products.json().length)];
        this.products.push({
          quantity: 1,
          label: product.description,
          amount: product.price,
          id: product._id
        });

        this.total = this.totalProducts() + this.tipAmount;

        this.presentToast();
      }
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
    this.productService.pay(this.products[0].id, this.tipAmount).then(() => {
      // Decrease local user account
      this.userData.setAmount(this.amount - (this.totalProducts() + this.tipAmount));
      // Go to result page
      this.navCtrl.push(ResultPage,{
        tipAmount: this.tipAmount,
        productCount: this.products[0].quantity,
        productLabel: this.products[0].label,
        productAmount: this.products[0].amount
      });
    });
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Votre paiement a été initié',
      duration: 3000,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

}
