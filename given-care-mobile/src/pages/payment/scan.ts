import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ConfirmPage } from './confirm';

declare var Instascan: any;

@Component({
  selector: 'page-payment-scan',
  templateUrl: 'scan.html'
})
export class ScanPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
  }

  ionViewDidLoad(){
    const scanner = new Instascan.Scanner({
      video: document.getElementById('preview'),
      mirror: false
    });
    scanner.addListener('scan', (content) => {
      alert(content);
    });
    Instascan.Camera.getCameras().then((cameras) => {
      const c = this.selectCameras(cameras);
      if (c) {
        scanner.start(c);
      } else {
        console.error('No cameras found.');
      }
    }).catch( (e) => {
      console.error(e);
    });
  }

  confirm(value) {
    this.navCtrl.push(ConfirmPage);
  }

  selectCameras(cameras) {
    if(cameras.length == 0) return null;
    const back = cameras.find(c => {
      c.name && c.name.toLowerCase().indexOf('back') >= 0
    });
    if(back) return back;
    return cameras[cameras.length - 1];
  }

}
