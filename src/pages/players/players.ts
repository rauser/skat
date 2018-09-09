import { Component } from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController} from 'ionic-angular';
import {AuthProvider} from "../../providers/auth/auth";
import {AngularFirestore} from 'angularfire2/firestore';
import {PlayerdetailPage} from "../playerdetail/playerdetail";
import {CreateplayerPage} from "../createplayer/createplayer";
import {WelcomePage} from "../welcome/welcome";

@IonicPage()
@Component({
  selector: 'page-players',
  templateUrl: 'players.html',
})
export class PlayersPage {

  players: any[] = [];

  constructor(public navCtrl: NavController,
              public auth: AuthProvider,
              public alertCtrl: AlertController,
              public modalCtrl: ModalController,
              private fireStore: AngularFirestore) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlayersPage');
    this.loadPlayers();
  }

  loadPlayers(){
    this.fireStore.collection<any>('players').snapshotChanges().subscribe((res) =>
      {
        this.players = [];
        console.log(res);
        for(let player of res){
          this.players.push({
            id: player.payload.doc.id,
            name: player.payload.doc.data().name,
            picture: player.payload.doc.data().picture,
            motto: player.payload.doc.data().motto,
          });
        }
      },
      (err) => {console.log(err)},
      () => {console.log('Complete')}
    );
  }

  showPlayer(id: string){
    this.navCtrl.push(PlayerdetailPage, {id: id});
  }

  removePlayer(id:string){
    let alert = this.alertCtrl.create({
    title: 'Spieler löschen',
    message: 'Sicher, dass du diesen Spieler löschen willst?',
    buttons: [
      {
        text: 'Abbrechen',
        role: 'cancel',
        handler: () => {
          console.log('Delete cancelled');
        }
      },
      {
        text: 'Löschen',
        handler: () => {
          console.log('Delete confirmed');
          this.fireStore.doc('players/'+id).delete().then(() => {
            console.log('Delete successfull');
          });
        }
      }
    ]});
    alert.present();
  }

  newPlayer(){
    let newPlayerModal = this.modalCtrl.create(CreateplayerPage);
    newPlayerModal.onDidDismiss(() => {this.loadPlayers()});
    newPlayerModal.present();
  }

  logout(){
    this.auth.signOut().then(() => {
      this.navCtrl.push(WelcomePage);
    }) .catch(() => {
      this.navCtrl.push(WelcomePage);
    })
  }


}
