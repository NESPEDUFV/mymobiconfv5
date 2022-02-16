import { NavigationExtras, Router } from '@angular/router';
import { AtividadesService } from './../../../services/atividades.service';
import { Component, OnInit } from '@angular/core';
import { AtividadeInterface } from 'src/app/services/atividades.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-notif-modal',
  templateUrl: './notif-modal.component.html',
  styleUrls: ['./notif-modal.component.scss'],
})
export class NotifModalComponent implements OnInit {
  /** Lista das atividades que estão mostradas como notificação */
  lista: AtividadeInterface[];

  /**
   * Adquire a lista passada como parâmetro, através do `navParams`
   * @param navParams
   * @param viewCtrl Usado para fechar este modal
   * @param navCtrl Usado para mostrar páginas de atividade
   * @param atividades Usado para adquirir dados de atividade por ID
   */
  constructor(
     // navParams: NavParams,
      //private viewCtrl: ViewController,
      public modalController: ModalController,
      private router: Router,
      private atividades: AtividadesService
  ) {
    if(this.router.getCurrentNavigation().extras.state){
      console.log("has extras");
      this.lista = this.router.getCurrentNavigation().extras.state.lista;
    }

  }
  ngOnInit(): void {

  }

  /**
   * Acessa a página da atividade correspondente à notificação
   * @param notif Notificação de atividade agendada
   */
  acessar(notif: AtividadeInterface) {

    let navigationExtras: NavigationExtras = {
      state: {
        ativ:this.atividades.getAtividadePorID(notif.ID),

       }
      }

      if (navigationExtras.state.ativ)
          this.router.navigate(['atividade-info'],navigationExtras);
  }

  /** Fecha este modal */
  dismiss() {
     // this.viewCtrl.dismiss();.
     this.modalController.dismiss({
      'dismissed': true
    });
  }


}
