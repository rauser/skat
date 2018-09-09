import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import {AuthProvider} from "../../providers/auth/auth";
import {WelcomePage} from "../welcome/welcome";
import {AngularFirestore} from 'angularfire2/firestore';
import {CreatesessionPage} from "../createsession/createsession";
import {SessiondetailPage} from "../sessiondetail/sessiondetail";


@IonicPage()
@Component({
  selector: 'page-sessions',
  templateUrl: 'sessions.html',
})
export class SessionsPage {

  sessions: any[] = [];

  constructor(public navCtrl: NavController,
              public auth: AuthProvider,
              public modalCtrl: ModalController,
              private fireStore: AngularFirestore) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SessionsPage');
    this.loadSessions();
  }

  loadSessions(){
    this.fireStore.collection<any>('sessions', ref => (ref.where('active', '==', true))).snapshotChanges().subscribe((res) =>
      {
        this.sessions = [];
        console.log(res);
        for(let session of res){
          this.sessions.push({
            id: session.payload.doc.id,
            name: session.payload.doc.data().name,
            date: session.payload.doc.data().date,
            player1name: session.payload.doc.data().player1name,
            player1id: session.payload.doc.data().player1id,
            player2name: session.payload.doc.data().player2name,
            player2id: session.payload.doc.data().player2id,
            player3name: session.payload.doc.data().player3name,
            player3id: session.payload.doc.data().player3id,
            player4name: session.payload.doc.data().player4name,
            player4id: session.payload.doc.data().player4id,
          });
        }
      },
      (err) => {console.log(err)},
      () => {console.log('Complete')}
    );
  }

  openSession(id: string){
    this.navCtrl.push(SessiondetailPage, {id: id});
  }

  newSession(){
    let newSessionModal = this.modalCtrl.create(CreatesessionPage);
    newSessionModal.onDidDismiss(() => {this.loadSessions()});
    newSessionModal.present();
  }

  logout(){
    this.auth.signOut().then(() => {
      this.navCtrl.push(WelcomePage);
    }) .catch(() => {
      this.navCtrl.push(WelcomePage);
    })
  }

}
