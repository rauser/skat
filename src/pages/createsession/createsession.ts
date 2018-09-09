import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AngularFirestore} from 'angularfire2/firestore';
import {VariousProvider} from "../../providers/various/various";

@IonicPage()
@Component({
  selector: 'page-createsession',
  templateUrl: 'createsession.html',
})
export class CreatesessionPage {

  isReadyToSave: boolean;
  item: any;
  form: FormGroup;
  players: any[] = [];

  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              private formBuilder: FormBuilder,
              public varProv: VariousProvider,
              private fireStore: AngularFirestore) {
    this.form = formBuilder.group({
      name: ['', Validators.required],
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreatesessionPage');
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
            selected: false,
          });
        }
      },
      (err) => {console.log(err)},
      () => {console.log('Complete')}
    );
  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  done(){
    let today = new Date().toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric'});
    console.log(today);
    let counter = 0;
    let player1name, player1id, player2name, player2id, player3name, player3id, player4name, player4id;
    let player1picture, player2picture, player3picture, player4picture;
    for(let player of this.players){
      if(player.selected){
        counter++;
        if(counter == 1){
          player1name = player.name;
          player1id = player.id;
          player1picture = player.picture;
        }
        if(counter == 2){
          player2name = player.name;
          player2id = player.id;
          player2picture = player.picture;
        }
        if(counter == 3){
          player3name = player.name;
          player3id = player.id;
          player3picture = player.picture;
        }
        if(counter == 4){
          player4name = player.name;
          player4id = player.id;
          player4picture = player.picture;
        }
        if(counter > 4){
          this.varProv.showToast('Du kannst nicht mehr als 4 Spieler auswählen');
          return;
        }
      }
    }
    if(counter < 4){
      player4name = null;
      player4id = null;
      player4picture = null;
    }
    if(counter < 3){
      this.varProv.showToast('Du musst mindestens 3 Spieler auswählen');
      return;
    }
    this.fireStore.collection<any>('sessions').add(
      {
        name: this.form.controls['name'].value,
        date: today,
        player1name: player1name,
        player1id: player1id,
        player1picture: player1picture,
        player2name: player2name,
        player2id: player2id,
        player2picture: player2picture,
        player3name: player3name,
        player3id: player3id,
        player3picture: player3picture,
        player4name: player4name,
        player4id: player4id,
        player4picture: player4picture,
        active: true,
      }
    ).then((res) => {
      console.log(res);
      this.viewCtrl.dismiss();
    }).catch((err) => {
      console.log(err);
    });  }

}
