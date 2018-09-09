import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AngularFirestore} from 'angularfire2/firestore';

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

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
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
      this.loadSessions();
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
    })
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

}
