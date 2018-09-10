import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import {WelcomePageModule} from "../pages/welcome/welcome.module";
import {LoginPageModule} from "../pages/login/login.module";
import {TabsPageModule} from "../pages/tabs/tabs.module";
import {SessionsPageModule} from "../pages/sessions/sessions.module";
import {AngularFireModule} from 'angularfire2';
import {AuthProvider} from "../providers/auth/auth";
import {AngularFireAuth} from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { firebaseConfig } from './credentials';
import {CreateplayerPageModule} from "../pages/createplayer/createplayer.module";
import {CreatesessionPageModule} from "../pages/createsession/createsession.module";
import {SessiondetailPageModule} from "../pages/sessiondetail/sessiondetail.module";
import {PlayersPageModule} from "../pages/players/players.module";
import {PlayerdetailPageModule} from "../pages/playerdetail/playerdetail.module";
import {VariousProvider} from "../providers/various/various";

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    WelcomePageModule,
    LoginPageModule,
    TabsPageModule,
    SessionsPageModule,
    CreateplayerPageModule,
    CreatesessionPageModule,
    SessiondetailPageModule,
    PlayersPageModule,
    PlayerdetailPageModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Camera,
    AuthProvider,
    AngularFireAuth,
    VariousProvider,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}
