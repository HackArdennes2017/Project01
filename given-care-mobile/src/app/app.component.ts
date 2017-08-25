import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

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
    { title: 'Home', component: HomePage, index: 1, icon: 'home' }
    //{ title: 'My profile', component: HomePage, index: 2, icon: 'ion-person' },
    //{ title: 'Add a device', component: HomePage, index: 2, icon: 'add-circle' },
    //{ title: 'Get help', component: HomePage, index: 3, icon: 'help-circle' },
    //{ title: 'Feedback', component: FeedbackPage, index: 4, icon: 'chatbubbles' }
  ];
  loggedInPages: PageObj[] = [
    { title: 'List', component: ListPage, index: 1, icon: 'home' }
  ];

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    

    // used for an example of ngFor and navigation
    /*
    this.pages = [
      { title: 'Home', component: HomePage },
      { title: 'List', component: ListPage }
    ];
    */

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
}
