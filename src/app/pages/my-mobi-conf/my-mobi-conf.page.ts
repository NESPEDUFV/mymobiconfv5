import { FirebaseService } from '../../services/firebase/firebase.service';
import { Router } from '@angular/router';
import { EventoService } from '../../services/evento.service';
import { EventoInfoPage } from '../evento-info/evento-info.page';

import { SocialPage } from '../social/social.page';
import { NoticiasPage } from '../noticias/noticias.page';
import { ParceirosPage } from '../parceiros/parceiros.page';
import { QuestionariosPage } from '../questionarios/questionarios.page';
import { AtividadesPage } from '../atividades/atividades.page';
import { EventosPage } from '../eventos/eventos.page';
import { LoginPage } from '../login/login.page';
import { OverlayService } from '../../services/overlay.service';
import { AtividadesService,AtividadeInterface } from '../../services/atividades.service';
import { UsuarioService } from '../../services/usuario.service';
import { ConfigService } from '../../services/config.service';
import { DatasUtil } from '../../utils/datas';
import {OpinarPage} from '../opinar/opinar.page';
import { MenuController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FcmService } from 'src/app/services/firebase/fcm.service';


@Component({
  selector: 'app-my-mobi-conf',
  templateUrl: './my-mobi-conf.page.html',
  styleUrls: ['./my-mobi-conf.page.scss'],
})
export class MyMobiConfPage implements OnInit {


   /** Data corrent */
   data: Date;


   /** @ignore */
   private ready: boolean = false; // Impede que outras coisas apareçam antes de todos os dados estarem carregados
  constructor(
    public menuCtrl: MenuController,
    private evento: EventoService,
    private overlay: OverlayService,
    private router: Router,
    private firebaseNotif: FirebaseService,
    private platform: Platform,
//   private splashScreen: SplashScreen,
  //  private statusBar: StatusBar,
    private fcmService: FcmService
  ) {
    console.log(this.evento.buscarInfo());
   }

  ngOnInit() {
    this.firebaseNotif.getNoticiaBehavior().subscribe((val : boolean) => {
      this.consultaNotifica(val)
  })

   // O código abaixo é a antiga forma de funcionamento, criada pelo Henrique. Ela teve que ser alterada, porque uma condição teve que ser verificada(se tem gamificaçãão ou não)
    /*
    let msgs: string[] = PassosMsgs[PassosTutorial.PagPrincipal];
        this.passos.push({ el: this.tutUtils, msg: msgs[0] });
        this.passos.push({ el: this.tutNotif, msg: msgs[1] });
        this.passos.push({ el: this.tutGame, msg: msgs[2] });
        this.tutBotoes.forEach((el, i) => { this.passos.push({ el: el, msg: msgs[i + 3] }); });
        this.passos.push({ el: this.tutMenu, msg: msgs[msgs.length - 1] });
    */
  }

ionViewWillEnter() {



}
    /** Define os botões principais */
    botoes: { id: string, label: string, pagina: string}[] = [
      { id: "atividades", label: "Atividades", pagina: 'atividades' },
      { id: "questionarios", label: "Questionários", pagina: 'questionarios'  },
      { id: "opinar", label: "Opinar", pagina: 'opinar'  },
      { id: "parceiros", label: "Parceiros", pagina: 'parceiros'  },
      { id: "noticias", label: "Notícias", pagina:'noticias'},
      { id: "social", label: "Social", pagina: 'social'}
  ];


  /**Teste de notificao
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
     // this.splashScreen.hide();

      // Trigger the push setup
      this.fcmService.initPush();
    });
  }
  */


   /**
     * Concede acesso às partes principais do app, se estiver em um evento
     * @param pagina Página a ser acessada
     */
    acessarPagina(pagina: any) {
      console.log("botão clicado");
      console.log(pagina);
      //if (!this.ready) return;
      if (this.evento.existeDados()){
       // console.log("dentro if\n");
        //console.log(this.evento.getNome())
        this.router.navigate([pagina]);
      }

          //this.navCtrl.push(pagina, { participa: this.participaGame });
      else
          this.alertEvento();
  }

  /**
     * Acessa a página de utilidades do evento
     */
   acessarUtils() {
    if (!this.ready) return;
    if (this.evento.existeDados())
        this.router.navigate(['eventos-info']);
    else
        this.alertEvento();
}


   /**
     * Apresenta um alerta de nenhum evento inscrito
     */
    private alertEvento() {
      console.log("sem inscrição em evento\n");
      this.overlay.createAlert(
          "Nenhum evento inscrito",
          "Por favor, inscreva-se em um evento.",
          'OK'
      );

      this.router.navigate(['eventos']);
  }
   /**
     * Acessa as notificações, mostrando um aviso caso tenha 0 ou 1 atividade agendada na hora, ou
     * mostra o modal com a lista de atividades agendadas
     */
    acessarNotif() {
      if (!this.ready) return;
      //let n: number = this.agendadasAgora.length;
      let n: number = 0;
      if (this.evento.existeDados()) {
          if (n == 0)
              this.overlay.createAlert(
                  "Nenhuma atividade agendada está para começar",
                  '',
                  'OK'
              )
                //TODO:  o resto dessa função
      } else
          this.alertEvento();
  }

   // -- Parte das notificações

   consultaNotifica(bol : boolean){
     console.log("consulta notifica")
    if(bol == true){
        console.log("true, tem noticia")
        return this.botoes[4].id = "noticiasNotif";
    } else {
        console.log("false, não tem noticia")
        return this.botoes[4].id =  "noticias";
    }
  }


destacaBotao( botId : string ){
    if(botId == "noticiasNotif"){ return "botaoGameDestaque"}
    return ""
  }

}
