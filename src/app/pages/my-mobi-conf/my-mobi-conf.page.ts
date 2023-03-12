import { OverlayService } from './../../services/overlay.service';
import { GameParticipanteService } from './../../services/game/participante.service';
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
import { AtividadesService,AtividadeInterface } from '../../services/atividades.service';
import { UsuarioService } from '../../services/usuario.service';
import { ConfigService } from '../../services/config.service';
import { DatasUtil } from '../../utils/datas';
import {OpinarPage} from '../opinar/opinar.page';
import { IonMenu, MenuController } from '@ionic/angular';
import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FcmService } from 'src/app/services/firebase/fcm.service';
import { ConfiguracoesService, GameConfiguracoesInterface } from 'src/app/services/game/configuracoes.service';
import { PassosMsgs, PassosTutorial } from 'src/app/components/tutorial/passos';
import { GamegrupoService } from 'src/app/services/game/grupo.service';


@Component({
  selector: 'app-my-mobi-conf',
  templateUrl: './my-mobi-conf.page.html',
  styleUrls: ['./my-mobi-conf.page.scss'],
})
export class MyMobiConfPage implements OnInit {

  public botaoPerfil: boolean = false;
  public  participaGame: boolean = false;
  public existeGamification = false;
  @ViewChild(IonMenu) menu: IonMenu;

   /** Data corrent */
   data: Date;


   /** Lista de atividades agendadas que estão em seu horário */
   private agendadasAgora: AtividadeInterface[] = [];

    /** @ignore */
    @ViewChildren('principais', { read: ElementRef }) tutBotoes: QueryList<ElementRef>;
    /** @ignore */
    @ViewChild('menu', { read: ElementRef }) tutMenu: ElementRef;
    /** @ignore */
    @ViewChild('game', { read: ElementRef }) tutGame: ElementRef;
    /** @ignore */
    @ViewChild('utils', { read: ElementRef }) tutUtils: ElementRef;
    /** @ignore */
    @ViewChild('notif', { read: ElementRef }) tutNotif: ElementRef;
    /** Controla quando o tutorial é ativado */
    ativarTut: boolean = false;
    /** Passos do tutorial desta página */
    passos: { el: ElementRef, msg: string }[] = [];

        /** Define os botões principais */
        botoes: { id: string, label: string, pagina: string}[] = [
          { id: "atividades", label: "Atividades", pagina: 'atividades' },
          { id: "questionarios", label: "Questionários", pagina: 'questionarios'  },
          { id: "opinar", label: "Opinar", pagina: 'opinar'  },
          { id: "parceiros", label: "Parceiros", pagina: 'parceiros'  },
          { id: "noticias", label: "Notícias", pagina:'noticias'},
          { id: "social", label: "Social", pagina: 'social'}
      ];

   /** @ignore */
   private ready: boolean = false; // Impede que outras coisas apareçam antes de todos os dados estarem carregados
  constructor(
    public menuCtrl: MenuController,
    public evento: EventoService,
    private overlay: OverlayService,
    private router: Router,
    private firebaseNotif: FirebaseService,
    //private platform: Platform,
    public usuario: UsuarioService,
    private gameConfig: ConfiguracoesService,
    private atividades: AtividadesService,
    private gameParticipante: GameParticipanteService,
    private gameGrupo: GamegrupoService,
    private config: ConfigService,
    // private splashScreen: SplashScreen,
    // private statusBar: StatusBar,
   // private fcmService: FcmService
  ) {
    console.log(this.evento.buscarInfo());
   }

  ngOnInit() {
    this.firebaseNotif.getNoticiaBehavior().subscribe((val : boolean) => {
      this.consultaNotifica(val)
  })

  }

 /**
     * Ao entrar na página, determina a data atual, liga o menu lateral, e carrega primeiramente o usuário. Caso não esteja logado, redireciona para a página de login. Ao verificar que o usuário existe, carrega os dados do evento e das configurações, preparando para mostrar as notificações que vão aparecer e o tutorial da página
     */
 ionViewWillEnter() {
  this.gameConfig.carregarConfiguracoes(() => {}, () => {});
  this.firebaseNotif.getNoticiaBehavior().subscribe((val : boolean) => {
      this.consultaNotifica(val)
  })
  this.menuCtrl.enable(true);
  this.data = new Date();
  this.usuario.disponivel(() => {
      if (this.usuario.existeDados()) {
          this.evento.disponivel(() => {
              this.ready = true;
              if (this.evento.existeDados())
                  this.atividades.disponivel(() => {
                      this.agendadasAgora = this.atividades.listarAgendadas(true);
                  });
              else
                  this.agendadasAgora = [];
          });
          this.config.disponivel(() => {
              setTimeout(() => {
                  if (!this.config.tutorialFoiVisto(PassosTutorial.PagPrincipal)) {
                      this.menuCtrl.close();
                      this.menuCtrl.swipeGesture(false);
                      this.ativarTut = true;
                  }
              }, 200);
          });
      }  else {
        this.ready = true;
        this.router.navigate(['/login']).then(() => {
          this.router.navigate(['/eventos'], { state: { from: 'login' } });
        });
      }
  });

  //gamification
  this.botaoPerfil = false;
  this.participaGame = false;
  this.existeGamification = false;

  this.evento.carregar(() => {
      //--console.log("CARREGAR DADOS EVENTO");
      if (this.evento.existeDados()) { //participante está em um evento
          //--console.log("CARREGOU DADOS EVENTO");

          this.carregaConfigGame(() => {
              this.carregarPerfilGame();
          });

      } else { //participante não está participando de nenhum evento
          this.existeGamification = false;
          this.botaoPerfil = false;
          this.gameParticipante.apagar();
          this.gameGrupo.apagar();
      }
  });

  let n: number = this.agendadasAgora.length;
  if(n!=0)
      if(this.agendadasAgora[0].mostraNotif == false)
          this.agendadasAgora = []

  this.tutorial();
}

tutorial(){
  if (this.evento.getGamificacao() == 1){
      if (!this.config.tutorialFoiVisto(PassosTutorial.PagPrincipal)) {
           //ABAIXO FUNCIONANDO PARA TODOS OS EVENTOS, MAS COM UMA MUDANÇA NA ORDEM DO TUTORIAL

           this.passos = [
              { el: this.tutMenu, msg: PassosMsgs[PassosTutorial.PagPrincipal][9] },
              { el: this.tutUtils, msg: PassosMsgs[PassosTutorial.PagPrincipal][0] },
              { el: this.tutNotif, msg: PassosMsgs[PassosTutorial.PagPrincipal][1] },
              { el: this.tutGame, msg: PassosMsgs[PassosTutorial.PagPrincipal][2] }
          ];
          let msgs: string[] = PassosMsgs[PassosTutorial.PagPrincipal];
          this.tutBotoes.forEach((el, i) => { this.passos.push({ el: el, msg: msgs[i + 3] }); });


          this.ativarTut = true;
      }
  }else{
      if (!this.config.tutorialFoiVisto(PassosTutorial.PagPrincipal)) {
          //ABAIXO FUNCIONANDO PARA TODOS OS EVENTOS, MAS COM UMA MUDANÇA NA ORDEM DO TUTORIAL

          this.passos = [
              { el: this.tutMenu, msg: PassosMsgs[PassosTutorial.PagPrincipal][9] },
              { el: this.tutUtils, msg: PassosMsgs[PassosTutorial.PagPrincipal][0] },
              { el: this.tutNotif, msg: PassosMsgs[PassosTutorial.PagPrincipal][1] },
          ];
          let msgs: string[] = PassosMsgs[PassosTutorial.PagPrincipal];
          this.tutBotoes.forEach((el, i) => { this.passos.push({ el: el, msg: msgs[i + 3] }); });


          this.ativarTut = true;

      }
  }
}





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


  mostraBotaoJogo() {
    if (!this.evento.existeDados()) {
        this.existeGamification = false;
        this.gameParticipante.apagar();
        this.gameGrupo.apagar();
        return;
    }
    //this.gameParticipante.removerParticipanteLocal();
    if (!this.botaoPerfil) { //se o botao ainda nao esta selecionado


        if (this.participaGame) { //perfil já carregado
            if (parseInt(this.evento.getID()) == this.gameParticipante.getIDEvento()) { //evento carregado é o inscrito
                //--console.log("Já carregado " + this.gameParticipante.getNome());

                this.botaoPerfil = true; //mostra submenu

            } else { //evento carregado não é o mesmo inscrito no momento
                this.gameParticipante.existePerfil(this.usuario.getID(), this.evento.getID(), () => { //verifica se já existe um perfil criado no servidor
                    this.criaPerfil();
                    this.botaoPerfil = !this.botaoPerfil;
                }, () => { //se não existe, pergunta se deseja criar um
                    this.alertaBotao();
                });
            }


        } else { //perfil não carregado
            this.gameParticipante.existePerfil(this.usuario.getID(), this.evento.getID(), () => { //verifica se já existe um perfil criado no servidor
                this.criaPerfil();
                this.botaoPerfil = !this.botaoPerfil;
            }, () => { //se não existe, pergunta se deseja criar um
              this.alertaBotao();
            });
        }

    } else {
        this.botaoPerfil = false;
    }



}

alertaBotao(){
 this.overlay.presentAlertWithMultipleHandlers(
    "Deseja inscrever-se no game do evento?",
    "<html>Participe para uma melhor experiência, tanto com o evento, quanto com o App!<br><br> <b>Venha se divertir, enquanto sua opinião é ouvida!</b></html>",
    [
    {
    text: 'Sim',
    handler: () => {
    this.criaPerfil(true);
    }
    },
    {
    text: 'Mais Infos',
    handler: () => {
    this.mostraAlerta("Game do Evento", "Ao participar, você terá a chance de ter seu próprio perfil, criar ou participar de um grupo de participantes, ganhar pontos, conquistas, medalha, troféus e insígnias, além de participar de um ranking e ter informações privilegiadas sobre as avaliações de atividades e as opiniões dos participantes sobre o evento!");
    }
    },
    {
    text: 'Mais tarde',
    handler: () => {
    this.gameParticipante.apagar();
    }
    }
    ]
  );

}

criaPerfil(novo?:boolean) {

  if (this.usuario.getID() != null && this.evento.getID() != null) {

      this.gameParticipante.cadastrarParticipante(this.usuario.getID(), this.evento.getID(), () => {

          if(novo){
              this.carregarPerfilGame(novo);
          }else{
              this.carregarPerfilGame();
          }
      }, (mensagem) => {
          this.mostraAlerta("Erro ao cadastrar participante", mensagem);
      });

  }
}


private mostraAlerta(titulo: string, subtitulo: string) {
  this.overlay.createAlert(titulo, subtitulo,'OK');
}

irParaPerfil() {
  this.router.navigate(['/perfil-game'], { queryParams: { idUser: this.usuario.getID(), evento: this.evento, primeira: true }});
}

irParaRanking() {
  this.router.navigate(['/ranking-page'], { queryParams: { tipo: 1, primeira: true }});
}
///Gamification

   /**
     * Concede acesso às partes principais do app, se estiver em um evento
     * @param pagina Página a ser acessada
     */
    acessarPagina(pagina: any) {
      if (!this.ready) return;
      if (this.evento.existeDados()){
        this.router.navigate([pagina]);
      }
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

  //gamification
  carregaConfigGame(okCb?: () => void, erroCb?: () => void) {
    this.gameConfig.carregar(() => {

        ////--console.log(this.gameConfig.existeDados() +"&&"+ (this.gameConfig.getIdEvento()+"") +"=="+ this.evento.getID())

        if (this.gameConfig.existeDados() && (this.gameConfig.getIdEvento() + "") == this.evento.getID()) {
            this.existeGamification = true;
            if (okCb) okCb();
            //--console.log("JA EXISTE CONFIGS");
        } else {
            //--console.log("NAO EXISTE CONFIGS AINDA");
            this.gameConfig.carregarConfiguracoes(() => {
                //--console.log("CARREGA CONFIGS");
                if (okCb) okCb();
                //if(this.evento.getGamificacao() == 1)
                this.existeGamification = true;
            }, () => {
                //--console.log("NAO EXISTE CONFIGS AINDA");
                this.existeGamification = false;
                this.botaoPerfil = false;
                this.participaGame = false;
                this.gameParticipante.apagar();
                this.gameGrupo.apagar();
                if (erroCb) erroCb();
                //this.mostraAlerta("Erro!", "Evento não possui gameficação!");
            });
        }
    });
}

carregarPerfilGame(novo?:boolean) {

  this.gameParticipante.carregar(() => {

      if (this.gameParticipante.existeDados() && this.usuario.getID() == (this.gameParticipante.getID() + "") && this.evento.getID() == this.gameParticipante.getIDEvento() + "") {

          this.participaGame = true;
          this.existeGamification = true;
          if(novo){

              this.mostraAlerta("Bem vindo!",
              "<html><b>IMPORTANTE!!!</b><br>"+
              "Clique nos ícones de ajuda 'i', em cada página, para mais informações.<br><br>"+
              "Ganhe <b>pontos e conquistas</b> avaliando as atividades e opinando.<br>"+
              "Veja o <b>ranking</b> dos melhores colocados.<br>"+
              "Veja as <b>avaliações</b> e <b>comentários</b> das atividades.<br>"+
              "Utilize <b>hashtags</b> ao dar opiniões para que seja visível aos outros participantes.<br>"+
              "Crie ou participe de um <b>grupo</b> para interagir com seus amigos."+
              "</html>");
              this.irParaPerfil();
          }

      } else {

          this.gameParticipante.existePerfil(this.usuario.getID(), this.evento.getID(), () => {
              this.gameParticipante.cadastrarParticipante(this.usuario.getID(), this.evento.getID(), () => {
                  this.participaGame = true;

              }, () => {

              });
          }, () => {

              this.gameParticipante.apagar();
              this.gameGrupo.apagar();

              this.participaGame = false;

          });

      }
  });

}


}
