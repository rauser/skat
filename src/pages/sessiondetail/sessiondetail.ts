import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {AngularFirestore} from 'angularfire2/firestore';
import {VariousProvider} from "../../providers/various/various";

export interface Games{
  id: number,
  name: string,
  value: number,
  img: string,
  selected: boolean
}

export interface Jacks{
  id: number,
  color: string,
  value: number,
  img: string,
  selected: boolean,
}

@IonicPage()
@Component({
  selector: 'page-sessiondetail',
  templateUrl: 'sessiondetail.html',
})
export class SessiondetailPage {

  session: any = {};
  sessionid: string;

  player1selected: boolean = false;
  player2selected: boolean = false;
  player3selected: boolean = false;
  player4selected: boolean = false;

  player1points: number = 0;
  player2points: number = 0;
  player3points: number = 0;
  player4points: number = 0;

  games: Games[] = [
    {id: 1, name: 'Karo', value: 9, img: 'assets/imgs/icons8-diamanten-48.png', selected: false},
    {id: 2, name: 'Herz', value: 10, img: 'assets/imgs/icons8-herzen-48.png', selected: false},
    {id: 3, name: 'Pik', value: 11, img: 'assets/imgs/icons8-pik-48.png', selected: false},
    {id: 4, name: 'Kreuz', value: 12, img: 'assets/imgs/icons8-kreuz-50.png', selected: false},
    {id: 5, name: 'Grand', value: 24, img: 'assets/imgs/G.png', selected: false},
    {id: 6, name: 'Null', value: 23, img: 'assets/imgs/N.png', selected: false},
    {id: 7, name: 'Ramsch', value: 0, img: 'assets/imgs/R.png', selected: false},
  ];

  jacks: Jacks[] = [
    {id: 1, color: 'Kreuz', value: 1, img: 'assets/imgs/KreuzBube.jpg', selected: false},
    {id: 2, color: 'Pik', value: 2, img: 'assets/imgs/PikBube.jpg', selected: false},
    {id: 3, color: 'Herz', value: 3, img: 'assets/imgs/HerzBube.jpg', selected: false},
    {id: 4, color: 'Karo', value: 4, img: 'assets/imgs/KaroBube2.jpg', selected: false},
  ];

  showpastgames: boolean = false;

  gamescounter = 0;

  pastgames: any[] = [];

  game: {playerid: number,
    player: string,
    img: string,
    gameid: number,
    game: string,
    mit: boolean,
    buben: number,
    multiplier: number,
    value: number,
    points: number,
    hand: boolean,
    schneider: boolean,
    schneiderangesagt: boolean,
    schwarz: boolean,
    schwarzangesagt: boolean,
    offen: boolean,
    lost: boolean,
    datetime: string,
    datetimeiso: string,
    player1points: number,
    player2points: number,
    player3points: number,
    player4points: number,
  } = {
    playerid: 0,
    player: '',
    img: '',
    gameid: 0,
    game: '',
    mit: false,
    buben: 0,
    multiplier: 0,
    value: 0,
    points: 0,
    hand: false,
    schneider: false,
    schneiderangesagt: false,
    schwarz: false,
    schwarzangesagt: false,
    offen: false,
    lost: false,
    datetime: '',
    datetimeiso: '',
    player1points: 0,
    player2points: 0,
    player3points: 0,
    player4points: 0,
  };

  constructor(public navCtrl: NavController,
              private fireStore: AngularFirestore,
              public alertCtrl: AlertController,
              public varProv: VariousProvider,
              public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SessiondetailPage');
    this.sessionid = this.navParams.data.id;
    this.loadSession();
    this.loadGames();
  }

  loadSession(){
    this.fireStore.doc<any>('sessions/'+this.sessionid).snapshotChanges().subscribe((res) =>
      {
        this.session = {};
        console.log(res);
        this.session = res.payload.data();
        console.log(this.session);
        this.calculatePlayerPoints();
      },
      (err) => {console.log(err)},
      () => {console.log('Complete')}
    );
  }

  loadGames(){
    this.fireStore.collection<any>('sessions/'+this.sessionid+'/games',
        ref => ref.orderBy('datetimeiso','desc'))
      .snapshotChanges().subscribe((res) =>
      {
        this.pastgames = [];
        console.log(res);
        let counter = 0;
        for(let game of res){
          this.pastgames.push(game.payload.doc.data());
          this.pastgames[counter].id = game.payload.doc.id;
          if(this.pastgames[counter].playerid==this.session.player1id){
            this.pastgames[counter].img = this.session.player1picture;
            this.pastgames[counter].player = this.session.player1name;
          }
          if(this.pastgames[counter].playerid==this.session.player2id){
            this.pastgames[counter].img = this.session.player2picture;
            this.pastgames[counter].player = this.session.player2name;
          }
          if(this.pastgames[counter].playerid==this.session.player3id){
            this.pastgames[counter].img = this.session.player3picture;
            this.pastgames[counter].player = this.session.player3name;
          }
          if(this.pastgames[counter].playerid==this.session.player4id){
            this.pastgames[counter].img = this.session.player4picture;
            this.pastgames[counter].player = this.session.player4name;
          }
          counter++;
        }
        console.log(this.pastgames);
        this.calculatePlayerPoints();
      },
      (err) => {console.log(err)},
      () => {console.log('Complete')}
    );
  }

  calculatePlayerPoints(){
    this.gamescounter = 0;
    this.player1points = 0;
    this.player2points = 0;
    this.player3points = 0;
    this.player4points = 0;
    for(let game of this.pastgames){
      this.gamescounter++;
      if(game.gameid != 7){
        if(game.playerid == this.session.player1id)  this.player1points += game.points;
        else if(game.playerid == this.session.player2id)  this.player2points += game.points;
        else if(game.playerid == this.session.player3id)  this.player3points += game.points;
        else if(game.playerid == this.session.player4id)  this.player4points += game.points;
      }
      else {
        console.log(game);
        if(game.player1points) this.player1points += game.player1points;
        if(game.player2points) this.player2points += game.player2points;
        if(game.player3points) this.player3points += game.player3points;
        if(game.player4points) this.player4points += game.player4points;
      }
    }
  }

  selectPlayer1(){
    this.player1selected = true;
    this.player2selected = false;
    this.player3selected = false;
    this.player4selected = false;
    this.game.playerid = this.session.player1id;
  }
  selectPlayer2(){
    this.player1selected = false;
    this.player2selected = true;
    this.player3selected = false;
    this.player4selected = false;
    this.game.playerid = this.session.player2id;
  }
  selectPlayer3(){
    this.player1selected = false;
    this.player2selected = false;
    this.player3selected = true;
    this.player4selected = false;
    this.game.playerid = this.session.player3id;
  }
  selectPlayer4(){
    this.player1selected = false;
    this.player2selected = false;
    this.player3selected = false;
    this.player4selected = true;
    this.game.playerid = this.session.player4id;
  }
  resetPlayers(){
    this.player1selected = false;
    this.player2selected = false;
    this.player3selected = false;
    this.player4selected = false;
  }

  selectGame(id: number){
    for(let game of this.games){
      game.selected = game.id == id;
      if(game.id == id){
        this.game.game = game.name;
        this.game.gameid = id;
      }
    }
    this.calculatePoints();
  }

  selectJack(id: number){
    this.game.mit = !this.game.mit;
    for(let jack of this.jacks){
      jack.selected = jack.id <= id;
      if(jack.id == id)
        this.game.buben = jack.value;
    }
    this.calculatePoints();
  }

  calculatePoints(){
    if(this.game.gameid < 6){
      this.game.multiplier = this.game.buben + 1;
      if(this.game.schneider)
        this.game.multiplier++;
      if(this.game.schwarz)
        this.game.multiplier++;
      if(this.game.hand){
        this.game.multiplier++;
        if(this.game.schneiderangesagt)
          this.game.multiplier++;
        if(this.game.schwarzangesagt)
          this.game.multiplier++;
        if(this.game.offen)
          this.game.multiplier++;
      }
      for(let game of this.games){
        if(this.game.gameid == game.id){
          this.game.value = game.value;
          this.game.points = this.game.value * this.game.multiplier;
        }
      }
    }
    else if(this.game.gameid == 6){
      this.game.points = 23;
      if(this.game.hand)
        this.game.points = 35;
      if(this.game.offen)
        this.game.points = 46;
      if(this.game.hand && this.game.offen)
        this.game.points = 59;
    }
    if(this.game.lost && this.game.gameid < 7){
      this.game.points *= -2;
    }
  }

  saveGame(){
    this.calculatePoints();
    this.game.datetimeiso = new Date().toISOString();
    this.game.datetime = new Date().toLocaleString('de-DE');
    this.game.player1points *= -1;
    this.game.player2points *= -1;
    this.game.player3points *= -1;
    this.game.player4points *= -1;
    console.log(this.game);
    this.fireStore.collection<any>('sessions/'+this.sessionid+'/games').add(this.game).then(() => {
      this.varProv.showToast('Spiel gespeichert');
      this.game.playerid = 0;
      this.game.player = '';
      this.game.img = '';
      this.game.gameid = 0;
      this.game.game = '';
      this.game.mit = false;
      this.game.buben = 0;
      this.game.multiplier = 0;
      this.game.value = 0;
      this.game.points = 0;
      this.game.hand = false;
      this.game.schneider = false;
      this.game.schneiderangesagt = false;
      this.game.schwarz = false;
      this.game.schwarzangesagt = false;
      this.game.offen = false;
      this.game.lost = false;
      this.game.datetime = '';
      this.game.datetimeiso = '';
      this.game.player1points = 0;
      this.game.player2points = 0;
      this.game.player3points = 0;
      this.game.player4points = 0;
      for(let game of this.games)
        game.selected = false;
      for(let jack of this.jacks)
        jack.selected = false;
      this.resetPlayers();
    });
  }

  showPastGames(){
    this.showpastgames = !this.showpastgames;
  }

  removeGame(id: string){
    let alert = this.alertCtrl.create({
      title: 'Spiel löschen',
      message: 'Sicher, dass du dieses Spiel löschen willst?',
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
            this.fireStore.doc<any>('sessions/'+this.sessionid+'/games/'+id).delete().then( () => {
                this.varProv.showToast('Spiel gelöscht');
              }
            )
          }
        }
      ]});
    alert.present();

  }

  archiveSession(){
    let alert = this.alertCtrl.create({
      title: 'Session archivieren',
      message: 'Sicher, dass du diese Session archivieren willst?',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: () => {
            console.log('Delete cancelled');
          }
        },
        {
          text: 'Archivieren',
          handler: () => {
            console.log('Delete confirmed');
            this.fireStore.doc<any>('sessions/'+this.sessionid).update({active: false}).then( () => {
                this.navCtrl.pop();
              }
            )
          }
        }
      ]});
    alert.present();
  }
}
