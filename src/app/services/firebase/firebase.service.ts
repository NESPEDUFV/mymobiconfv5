import { AlertController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  idDispositivo: string;
  novaNotif: boolean = false;
  noticiaBehavior = new BehaviorSubject<boolean>(false);

  constructor(public http: HttpClient,private alertCtrl: AlertController) { }

  getIdDispositivo() : string{ return this.idDispositivo}
  getNotifica() : boolean{return this.novaNotif}
  novaNotifica()  {this.novaNotif = true;}

  novaNoticia(){ this.noticiaBehavior.next(true)}
  leuNoticia() { this.noticiaBehavior.next(false)}
  getNoticiaBehavior() {
      return this.noticiaBehavior.asObservable();
  }


}
