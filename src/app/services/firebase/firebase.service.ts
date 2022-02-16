import { OverlayService } from './../overlay.service';
import { AlertController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';



@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  idDispositivo: string;
  novaNotif: boolean = false;
  noticiaBehavior = new BehaviorSubject<boolean>(false);

  constructor(public http: HttpClient,private alertCtrl: AlertController, private push: Push, private overlays: OverlayService) { }

  getIdDispositivo() : string{ return this.idDispositivo}
  getNotifica() : boolean{return this.novaNotif}
  novaNotifica()  {this.novaNotif = true;}

  novaNoticia(){ this.noticiaBehavior.next(true)}
  leuNoticia() { this.noticiaBehavior.next(false)}
  getNoticiaBehavior() {
      return this.noticiaBehavior.asObservable();
  }

  pushSetup(){

    const options: PushOptions = {
        android: {

            icon: 'http://www.mymobiconf.caf.ufv.br:8080/static/img/icon.png',
            senderID: '445932221604',

        },

        windows: {},
        browser: {
            pushServiceURL: 'http://push.api.phonegap.com/v1/push'
        }
     }

     const pushObject: PushObject = this.push.init(options);



     pushObject.on('notification').subscribe((data: any) =>{
        this.novaNoticia();
        if (data.additionalData.coldstart) {
            this.novaNotifica();
            this.novaNoticia();
        }
       else{
            this.novaNotifica();
            this.novaNoticia();}

        if(data.additionalData.foreground){
           // this.presentAlert()
            this.novaNotifica();
            this.novaNoticia();
        }
    });

     pushObject.on('registration').subscribe((registration: any) => {
         console.log('Device registered', registration)
         this.idDispositivo = registration.registrationId;
        });

     pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
    }

    presentAlert() {
      this.overlays.createAlert(
        'Nova notícia!',
        'Você acabou de receber uma nova notícia!',
        'Dispensar'
      )

    }

}
