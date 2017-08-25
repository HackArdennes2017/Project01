import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ConfirmPage } from './confirm';

import { ProductService } from '../../services/product.service';

@Component({
  selector: 'page-payment-scan',
  templateUrl: 'scan.html'
})
export class ScanPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public productService:ProductService) {
    setTimeout(() => {
      // Get all available products
      this.productService.getProducts().subscribe((products) => {
        // Get a random product
        if(products && products.json() && products.json().length > 0){
          const product = products.json()[Math.floor(Math.random()*products.json().length)];
          this.navCtrl.push(ConfirmPage,{
            productCount: 1,
            productLabel: product.description,
            productAmount: product.price,
            productId: product._id
          });
        }
      });      
    }, 5000);
  }


}
