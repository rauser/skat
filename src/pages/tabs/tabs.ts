import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import {SessionsPage} from "../sessions/sessions";
import {PlayersPage} from "../players/players";

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root: any = SessionsPage;
  tab2Root: any = PlayersPage;

  tab1Title = "Sessions";
  tab2Title = "Spieler";

  constructor(public navCtrl: NavController) {

  }
}
