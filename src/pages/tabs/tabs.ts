import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

import {SessionsPage} from "../sessions/sessions";
import {PlayersPage} from "../players/players";
import {StatisticsPage} from "../statistics/statistics";

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root: any = SessionsPage;
  tab2Root: any = PlayersPage;
  tab3Root: any = StatisticsPage;

  tab1Title = "Sessions";
  tab2Title = "Spieler";
  tab3Title = "Statistiken";

  constructor(public navCtrl: NavController) {

  }
}
