import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, MenuController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ScanPage } from '../pages/payment/scan';
import { LoginPage } from '../pages/login/login';

import { WelcomePage } from '../pages/welcome/welcome';
import { ProjectsPage } from '../pages/projects/projects';

import { UserData } from '../providers/user-data/user-data';
import {ReportsPage} from "../pages/reports/reports";
import {AccountService} from '../services/account.service';

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
  ];
  loggedInPages: PageObj[] = [
    { title: 'Accueil', component: HomePage, index: 1, icon: 'home' },
    { title: 'Paiement', component: ScanPage, index: 10, icon: 'cash' },
    { title: 'Projets', component: ProjectsPage, index: 20, icon: 'flask'},
    { title: 'Reports', component: ReportsPage, index: 30, icon: 'disc'}
  ];

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public menu: MenuController, public events: Events, public userData: UserData, public accountService:AccountService) {
    this.initializeApp();

    // decide which menu items should be hidden by current login status stored in local storage
    this.enableMenu(false);

    this.userData.hasLoggedIn().then((hasLoggedIn) => {

      this.enableMenu(hasLoggedIn);

        if(hasLoggedIn === true) {
          this.accountService.getAccount().then((account:any) => {
            userData.setAmount(account.json().balance);
          });
          this.rootPage = HomePage;
        } else {
          //if(! this.userData.hasPassedTutorial) {
          //  this.rootPage = TutorialPage;
          //} else {
          this.rootPage = LoginPage;
          //}
        }
      });


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
    this.menu.enable(loggedIn);
  }
}
