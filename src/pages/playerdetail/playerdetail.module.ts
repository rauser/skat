import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlayerdetailPage } from './playerdetail';

@NgModule({
  declarations: [
    PlayerdetailPage,
  ],
  imports: [
    IonicPageModule.forChild(PlayerdetailPage),
  ],
})
export class PlayerdetailPageModule {}
