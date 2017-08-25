import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  
  message = null;
  constructor(public navCtrl: NavController, public navParams: NavParams, private userService: UserService) {
  }

  login(email, password) {
    this.userService.login(email, password)
      .subscribe(
        (data) => {
          this.message = 'Authentification OK';
        },
        (err) => {
          this.message = 'Erreur de connexion';
        }
      );
  }

}
