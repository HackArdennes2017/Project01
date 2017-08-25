import { Injectable } from '@angular/core';

import { Events }     from 'ionic-angular';
import { Storage }    from '@ionic/storage';


@Injectable()
export class UserData {
  HAS_LOGGED_IN = 'hasLoggedIn';
  JWT_TOKEN = 'jwtToken';
  EMAIL = 'email';

  constructor(private events: Events, public storage: Storage) {}

  resetUser() {
    this.setLoggedIn(false);
    this.setJwtToken(false);
    this.setEmail('');
  }


  logout() {
    this.storage.remove(this.HAS_LOGGED_IN);
    this.events.publish('user:logout');
  }


  setEmail(email) {
    this.storage.set(this.EMAIL, email);
  }

  getEmail() {
    return this.storage.get(this.EMAIL).then((value) => {
      return value;
    });
  }

  // return a promise
  hasLoggedIn() {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value;
    });
  }

  setLoggedIn(loggedIn) {
    this.storage.set(this.HAS_LOGGED_IN, loggedIn);
  }

  getJwtToken() {
    return this.storage.get(this.JWT_TOKEN).then((value) => {
      return value;
    });
  }

  setJwtToken(token) {
    this.storage.set(this.JWT_TOKEN, token);
  }
}
