import { Injectable } from '@angular/core';

import { Events }     from 'ionic-angular';
import { Storage }    from '@ionic/storage';


@Injectable()
export class UserData {
  //_favorites = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_PASSED_TUTORIAL = 'hasPassedTutorial';
  HAS_PASSED_ENROLMENT = 'hasPassedEnrolment';
  ENROLMENT_STEP = 'enrolmentStep';
  FIRSTNAME = 'firstName';
  LASTNAME = 'lastName';
  CLIENTID = 'clientId';
  JWT_TOKEN = 'jwtToken';
  USERID = 'userId';
  //EMAIL = 'email';

  
  


  constructor(private events: Events, public storage: Storage) {
    //this.setTutorialPassed(false);
    //this.setLoggedIn(false);
    //this.setTutorialPassed(false);
    //this.setEnrolmentStep(1);
  }

  resetUser() {
    this.setLoggedIn(false);
    this.setJwtToken(false);
    this.setEnrolmentPassed(false);
    this.setEnrolmentStep(1);
    this.setFirstName('');
    this.setLastName('');
    this.setClientId('');
    this.setUserId('');
  }

  /*
  hasFavorite(sessionName) {
    return (this._favorites.indexOf(sessionName) > -1);
  }

  addFavorite(sessionName) {
    this._favorites.push(sessionName);
  }

  removeFavorite(sessionName) {
    let index = this._favorites.indexOf(sessionName);
    if (index > -1) {
      this._favorites.splice(index, 1);
    }
  }
  */

  /*
  login(email) {
    this.storage.set(this.HAS_LOGGED_IN, true);
    //this.setEmail(email);
    this.events.publish('user:login');
  }

  signup(email) {
    this.storage.set(this.HAS_LOGGED_IN, true);
    //this.setEmail(email);
    this.events.publish('user:signup');
    console.log('we are signed up.... with email ' + email);
  }
  */


  logout() {
    this.storage.remove(this.HAS_LOGGED_IN);
    //this.storage.remove('email');
    this.events.publish('user:logout');
  }


  /*
  setEmail(email) {
    this.storage.set(this.EMAIL, email);
  }

  getEmail() {
    return this.storage.get(this.EMAIL).then((value) => {
      return value;
    });
  }
  */

  getLastName() {
    return this.storage.get(this.LASTNAME).then((value) => {
      return value;
    });
  }

  setLastName(lastName) {
    this.storage.set(this.LASTNAME, lastName);
  }

  getFirstName() {
    return this.storage.get(this.FIRSTNAME).then((value) => {
      return value;
    });
  }

  setFirstName(firstName) {
    this.storage.set(this.FIRSTNAME, firstName);
  }

  setLoggedIn(loggedIn) {
    this.storage.set(this.HAS_LOGGED_IN, loggedIn);
  }

  // return a promise
  hasLoggedIn() {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value;
    });
  }

  setTutorialPassed(passed) {
    this.storage.set(this.HAS_PASSED_TUTORIAL, passed);
  }

  hasPassedTutorial() {
    return this.storage.get(this.HAS_PASSED_TUTORIAL).then((value) => {
      return value;
    });
  }

  setEnrolmentStep(step) {
    this.storage.set(this.ENROLMENT_STEP, step);
  }

  getEnrolmentStep() {
    return this.storage.get(this.ENROLMENT_STEP).then((value) => {
      return value;
    });
  }

  setEnrolmentPassed(passed) {
    this.storage.set(this.HAS_PASSED_ENROLMENT, passed);
  }

  hasPassedEnrolment() {
    return this.storage.get(this.HAS_PASSED_ENROLMENT).then((value) => {
      return value;
    });
  }

  getClientId() {
    return this.storage.get(this.CLIENTID).then((value) => {
      return value;
    });
  }

  setClientId(clientId) {
    this.storage.set(this.CLIENTID, clientId);
  }

  getJwtToken() {
    return this.storage.get(this.JWT_TOKEN).then((value) => {
      return value;
    });
  }

  setJwtToken(token) {
    this.storage.set(this.JWT_TOKEN, token);
  }

  getUserId() {
    return this.storage.get(this.USERID).then((value) => {
      return value;
    });
  }

  setUserId(userId) {
    this.storage.set(this.USERID, userId);
  }
}
