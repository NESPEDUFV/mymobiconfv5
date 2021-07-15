import { AlertController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
//import { Push, PushObject, PushOptions } from '@ionic-native/push';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  idDispositivo: string;

  constructor() { }

  getIdDispositivo() : string{ return this.idDispositivo}
}
