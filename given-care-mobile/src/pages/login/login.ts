import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { ConfirmPage } from '../payment/confirm';

import { UserService } from '../../services/user.service';
import { AccountService } from '../../services/account.service';
import { UserData } from '../../providers/user-data/user-data';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  
  public message:string = null;
  constructor(public events: Events, public navCtrl: NavController, public navParams: NavParams, private userService: UserService, private accountService:AccountService, private userData: UserData) {}

  login(email, password) {
    this.message = '';
    this.userService.login(email, password)
      .subscribe(
        (response) => {
          this.userData.setLoggedIn(true);
          this.userData.setAmount(0);
          this.userData.setJwtToken(response.headers.get('authorization')).then(() => {
            this.events.publish('user:login');
            this.userService.me().then((resp:any) => {
              this.userData.setEmail(resp.json().email);
            });
            this.accountService.getAccount().then((account:any) => {
              this.userData.setAmount(account.json().balance);
              this.authSuccess();              
            });
          });
        },
        (err) => {
          this.message = 'Erreur de connexion : vérifiez vos identifiants';
        }
      );
  }
  
  register() {
    // Generate a user/password
    const randomString = (len) => Math.random().toString(36).substr(2, len);
    const email = `${randomString(5)}.${randomString(8)}@${randomString(5)}.com`;
    const password = randomString(10);
    this.message = '';
    this.userService.register(email, password)
      .subscribe(
        (data) => {
          this.login(email, password);
        },
        (err) => {
          this.message = 'Erreur de lors de la création de votre compte : vérifiez l\'adresse et le mot de passe (min 8 caractères)';
        }
      );
  }

  authSuccess() {
    this.navCtrl.setRoot(ConfirmPage);
  }


  
  

}
