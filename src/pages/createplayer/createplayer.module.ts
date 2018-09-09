import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateplayerPage } from './createplayer';

@NgModule({
  declarations: [
    CreateplayerPage,
  ],
  imports: [
    IonicPageModule.forChild(CreateplayerPage),
  ],
})
export class CreateplayerPageModule {}
