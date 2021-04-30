import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AlertController, LoadingController, Platform } from '@ionic/angular';

/**
 * Disponibiliza conteúdos que sobrepõem a tela - alerts e loadings - e notifica através de um `BehaviorSubject` quando há uma mudança na quantidade de sobreposição
 */
@Injectable({
  providedIn: 'root'
})
export class OverlayService {
    /** Quantidade de sobreposição. Permite observar mudanças neste valor */
    private amt: BehaviorSubject<number>;

  constructor(private alert: AlertController, private loading:LoadingController, private platform: Platform) {
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

    async createAlert(header:string, subheader:string,buttons:string) {
      let back: Function;
      const alert = await this.alert.create({
        header: header,
        subHeader: subheader,
        buttons: [buttons]
      });
     // alert.onDidDismiss(() => this.amt.next(0); back(); );
      await alert.present();
      this.amt.next(-0.5);
      this.platform.backButton.subscribeWithPriority(2,() => alert.dismiss());
    }

    /*
    createAlert(message:string, button:string): { present: () => void } {
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
      */


  /**
     * Cria um loading que muda a quantidade de overlay automaticamente
     * @param message texto a ser exibido no loading
     */
  async createLoading(message:string) {

    const load = await this.loading.create({
      message: message,
    });
    /*Falta aqui*/
   // const teste = await load.onDidDismiss(() => this.amt.next(0));
    await load.present();
    //back = this.platform.subscribeWithPriority(() => { }, 2);
                this.amt.next(-0.5);
                load.present();


  }
}
