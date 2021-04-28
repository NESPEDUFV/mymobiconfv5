import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlertController, LoadingController, Platform } from '@ionic/angular';

/**
 * Disponibiliza conteúdos que sobrepõem a tela - alerts e loadings - e notifica através de um `BehaviorSubject` quando há uma mudança na quantidade de sobreposição
 */
@Injectable()
export class OverlaysProvider {
     /** Quantidade de sobreposição. Permite observar mudanças neste valor */
     private amt: BehaviorSubject<number>;

     constructor(private alert: AlertController, private loading: LoadingController, private platform: Platform) {
         this.amt = new BehaviorSubject<number>(0);
     }

     /**
      * Permite observar o quantidade de overlay que está sendo aplicada
      * @returns Observable com a quantidade de overlay aplicada
      */
     get(): Observable<number> {
         return this.amt.asObservable();
     }

     /**
      * Muda a quantidade de overlay
      * @param val Valor da quantidade de overlay
      */
     set(val: number) {
         this.amt.next(val);
     }

     /**
      * Cria um alerta que muda a quantidade de overlay automaticamente
      * @param opts Opções do alerta
      */
    /* createAlert(opts?: AlertOptions): { present: () => void } {
         let alert = this.alert.create(opts);
         let back: Function;
         alert.onDidDismiss(() => { this.amt.next(0); back(); });
         return {
             present: () => {
                 back = this.platform.registerBackButtonAction(() => alert.dismiss(), 2);
                 this.amt.next(-0.5);
                 alert.present();
             }
         };
     }
     */

     async createAlert(header, message, buttons) {
      const alert = await this.alert.create({
        header: header,
        message: message ,
        buttons: [
          {
            text: 'Ok',
            role: '',
            cssClass: '',
            handler: () => {
              console.log('ok clicado');
            }
          },
        ]
      });

      await alert.present();
      return alert;
}


     /**
      * Cria um loading que muda a quantidade de overlay automaticamente
      * @param opts Opções do loading
      */
     /*Pause
     createLoading(opts?: LoadingOptions): { present: () => void, dismiss: () => void } {
         let loading = this.loading.create(opts);
         let back: Function;
         loading.onDidDismiss(() => this.amt.next(0));
         return {
             present: () => {
                 back = this.platform.registerBackButtonAction(() => { }, 2);
                 this.amt.next(-0.5);
                 loading.present();
             },
             dismiss: () => { loading.dismiss(); back(); }
         };
     }
*/

}
