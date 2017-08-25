import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ScanPage } from '../pages/payment/scan';

import { WelcomePage } from '../pages/welcome/welcome';

import { UserData } from '../providers/user-data/user-data';

export interface PageObj {
  title: string;
  component: any;
  icon: string;
  index?: number;
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  //pages: Array<{title: string, component: any}>;

  appPages: PageObj[] = [
    { title: 'Home', component: HomePage, index: 1, icon: 'home' },
    { title: 'Payment', component: PaymentPage, index: 10, icon: 'cash' }
  ];
  loggedInPages: PageObj[] = [
    { title: 'List', component: ListPage, index: 1, icon: 'list' }
  ];

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public menu: MenuController, public events: Events, public userData: UserData) {
    this.initializeApp();

    // decide which menu items should be hidden by current login status stored in local storage
    /*
    this.userData.hasLoggedIn().then((hasLoggedIn) => {
  
      this.enableMenu(hasLoggedIn === 'true');
  
        console.log('hasLoggedIn : ' + hasLoggedIn);
  
        if(hasLoggedIn === true) {
          this.rootPage = HomePage;
        } else {
          //if(! this.userData.hasPassedTutorial) {
          //  this.rootPage = TutorialPage;
          //} else {
          this.rootPage = WelcomePage;
          //}
        }
      });
      */

    this.listenToLoginEvents();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  listenToLoginEvents() {
    this.events.subscribe('user:login', () => {
      this.enableMenu(true);
    });

    this.events.subscribe('user:signup', () => {
      this.enableMenu(true);
      console.log('we are signed up... so we enable menu');
    });

    this.events.subscribe('user:logout', () => {
      this.enableMenu(false);
    });
  }

  enableMenu(loggedIn) {
    console.log('test');
    this.menu.enable(loggedIn, 'loggedInMenu');
    this.menu.enable(!loggedIn, 'loggedOutMenu');
  }
}
