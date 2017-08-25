//import { Storage } from '@ionic/storage';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ScanPage } from '../pages/payment/scan';
import { ConfirmPage } from '../pages/payment/confirm';
import { ResultPage } from '../pages/payment/result';
import { ProjectsPage } from '../pages/projects/projects';

import { UserService } from '../services/user.service';
import { BackendService } from '../services/backend.service';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserData } from '../providers/user-data/user-data';

import { IonicStorageModule } from '@ionic/storage';

import { HttpModule } from '@angular/http';
import {ReportsPage} from "../pages/reports/reports";
import {ReportService} from "../services/report.service";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    ScanPage,
    ConfirmPage,
    LoginPage,
    ProjectsPage,
    ReportsPage
    ResultPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    ScanPage,
    ConfirmPage,
    LoginPage,
    ResultPage
    ProjectsPage,
    ReportsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserData,
    UserService,
    BackendService,
    ReportService
    //Storage
  ]
})
export class AppModule {}
