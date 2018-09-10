import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AngularFirestore} from 'angularfire2/firestore';
import {VariousProvider} from "../../providers/various/various";

@IonicPage()
@Component({
  selector: 'page-playerdetail',
  templateUrl: 'playerdetail.html',
})
export class PlayerdetailPage {

  playerid: string = '';
  playername: string = '';
  motto: string = '';
  picture: string = '';

  sessions: any[] = [];
  games: any[] = [];

  totalpoints: number = 0;
  totalgames: number = 0;
  totalgameswon: number = 0;
  lostgamepoints: number = 0;
  wongamepoints: number = 0;
  bubenmitgames: number = 0;
  bubgenohnegames: number = 0;
  bubenmitcounter: number = 0;
  bubenohnecounter: number = 0;
  kreuzgames: number = 0;
  pikgames: number = 0;
  herzgames: number = 0;
  karogames: number = 0;
  grandgames: number = 0;
  nullgames: number = 0;
  kreuzgameswon: number = 0;
  pikgameswon: number = 0;
  herzgameswon: number = 0;
  karogameswon: number = 0;
  grandgameswon: number = 0;
  nullgameswon: number = 0;


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public varProv: VariousProvider,
              private fireStore: AngularFirestore) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlayerdetailPage');
    this.playerid = this.navParams.data.id;
    this.loadPlayer();
    this.loadSessions();
  }

  loadPlayer(){
    this.fireStore.doc<any>('players/'+this.playerid).snapshotChanges().subscribe((res) =>
      {
        console.log(res);
        this.playername = res.payload.data().name;
        this.motto = res.payload.data().motto;
        this.picture = res.payload.data().picture;
      },
      (err) => {console.log(err)},
      () => {console.log('Complete')}
    );
  }

  loadSessions(){
    this.sessions = [];
    let promises = [];
    promises.push(this.addSessions('player1id'));
    promises.push(this.addSessions('player2id'));
    promises.push(this.addSessions('player3id'));
    promises.push(this.addSessions('player4id'));
    Promise.all(promises).then(() => {
      console.log(this.sessions);
      this.loadGames();
    }).catch(() => {
      this.varProv.showToast('Statistik kann nicht geladen werden');
    });
  }

  addSessions(playernumber: string){
    return new Promise((resolve, reject) => {
      this.fireStore.collection<any>('sessions',
        ref => ref.where(playernumber,'==', this.playerid)).snapshotChanges().subscribe((res) =>
        {
          console.log(res);
          for (let session of res){
            this.sessions.push(session.payload.doc.id);
          }
          resolve();
        },
        (err) => {console.log(err); reject();},
        () => {console.log('Complete')}
      );
    });
  }

  loadGames(){
    this.games = [];
    let promises = [];
    for(let session of this.sessions){
      promises.push(this.addGames(session));
    }
    Promise.all(promises).then(()=> {
      console.log(this.games);
      this.calculateStatistics();
    }).catch(() => {
      this.varProv.showToast('Statistik kann nicht geladen werden');
    });
  }

  addGames(session: string){
    return new Promise((resolve, reject) => {
      this.fireStore.collection<any>('sessions/'+session+'/games',
        ref => ref.where('playerid','==', this.playerid)).snapshotChanges().subscribe((res) =>
        {
          console.log(res);
          for (let game of res){
            this.games.push(game.payload.doc.data());
          }
          resolve();
        },
        (err) => {console.log(err); reject();},
        () => {console.log('Complete')}
      );
    });

  }

  calculateStatistics(){
    this.totalpoints = 0;
    this.totalgames = 0;
    this.totalgameswon = 0;
    this.lostgamepoints = 0;
    this.wongamepoints = 0;
    this.bubenmitgames = 0;
    this.bubgenohnegames = 0;
    this.bubenmitcounter = 0;
    this.bubenohnecounter = 0;
    this.kreuzgames = 0;
    this.pikgames = 0;
    this.herzgames = 0;
    this.karogames = 0;
    this.grandgames = 0;
    this.nullgames = 0;
    this.kreuzgameswon = 0;
    this.pikgameswon = 0;
    this.herzgameswon = 0;
    this.karogameswon = 0;
    this.grandgameswon = 0;
    this.nullgameswon = 0;
    for(let game of this.games){
      if(game.gameid == 7) continue;
      this.totalgames++;
      this.totalpoints += game.points;
      if(!game.lost){
        this.totalgameswon++;
        this.wongamepoints += game.points;
      }
      if(game.gameid == 4){
        this.kreuzgames++;
        if(!game.lost) this.kreuzgameswon++;
      }
      if(game.gameid == 3){
        this.pikgames++;
        if(!game.lost) this.pikgameswon++;
      }
      if(game.gameid == 2){
        this.herzgames++;
        if(!game.lost) this.herzgameswon++;
      }
      if(game.gameid == 1){
        this.karogames++;
        if(!game.lost) this.karogameswon++;
      }
      if(game.gameid == 5){
        this.grandgames++;
        if(!game.lost) this.grandgameswon++;
      }
      if(game.gameid == 6){
        this.nullgames++;
        if(!game.lost) this.nullgameswon++;
      }
      if(game.gameid < 6){
        if(game.mit){
          this.bubenmitgames++;
          this.bubenmitcounter += game.buben;
        }
        else{
          this.bubgenohnegames++;
          this.bubenohnecounter += game.buben;
        }
      }
    }
  }
}
