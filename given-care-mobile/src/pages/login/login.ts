import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';

import { HomePage } from '../home/home';

import { UserService } from '../../services/user.service';
import { UserData } from '../../providers/user-data/user-data';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  
  public message:string = null;
  constructor(public events: Events, public navCtrl: NavController, public navParams: NavParams, private userService: UserService, private userData: UserData) {}

  login(email, password) {
    this.message = '';
    this.userService.login(email, password)
      .subscribe(
        (response) => {
          this.userData.setLoggedIn(true);
          this.userData.setJwtToken(response.headers.get('authorization'));
          this.authSuccess();
          this.events.publish('user:login');
          this.userService.me().then((resp:any) => {
            this.userData.setEmail(resp.json().email);
          });
        },
        (err) => {
          this.message = 'Erreur de connexion : vérifiez vos identifiants';
        }
      );
  }
  
  register(email, password) {
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
    this.navCtrl.setRoot(HomePage);
  }

}
