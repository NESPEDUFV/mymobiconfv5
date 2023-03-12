import { OpnioesService } from './../../services/opnioes.service';
import { ConfigService } from './../../services/config.service';
import { EventoService } from './../../services/evento.service';
import { UsuarioService } from './../../services/usuario.service';
import { OverlayService } from './../../services/overlay.service';
import { IonContent } from '@ionic/angular';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PassosTutorial, PassosMsgs } from '../../components/tutorial/passos';
import { DatasUtil } from 'src/app/utils/datas';
import { ConnectivityProvider } from 'src/app/services/rede2.service';

@Component({
  selector: 'app-opinar',
  templateUrl: './opinar.page.html',
  styleUrls: ['./opinar.page.scss'],
})
export class OpinarPage implements OnInit {
 /** `ion-content` da página */
    /** @ignore */
    @ViewChild(IonContent) content: IonContent;
    /** @ignore */
    @ViewChild('campo', { read: ElementRef }) tutCampo: ElementRef;
     /** @ignore */
    @ViewChild('privacidade', { read: ElementRef }) tutAnonimo: ElementRef;
     /** @ignore */
    @ViewChild('hashtags', { read: ElementRef }) tutHashtag: ElementRef;
    /** Controla quando o tutorial é ativado */
    ativarTut: boolean = false;
    /** Passos do tutorial desta página */
    passos: { el: ElementRef, msg: string }[] = [];

    /** Lista de opiniões */
    public listaOpinioes: {
        texto: string
        horaEnvio: string
        enviada: boolean
        anonimo: boolean //gamification
    }[] = [];
    /** Entrada de texto do usuário */
    public texto: string = "";

    /** Anônimo - Gamification*/
    public participaGame = false;
    public anonimo: boolean = true;
    public ganhou = false;

    //trocar any pra gameHasthags
    public hashtags: any[];
    public textoHashtags = "";
    public mostrarTextoHashtags = false;
    public qtdComentarios = 60;
    public qtdParaDeGanhar = 50;
    public qtdPerde = 70;


    /**
     * @param overlay
     * @param opinioes
     * @param usuario Usado para adquirir o ID do usuário
     * @param evento Usado para adquirir o ID do evento
     * @param rede Usado para configurar atualização da lista
     * @param config Usado para o tutorial
     */
    constructor(
        private overlay: OverlayService,
        private opinioes: OpnioesService,
        private usuario: UsuarioService,
        private evento: EventoService,
        private rede: ConnectivityProvider,
        private config: ConfigService,
        private alertCtrl: AlertController,
 //       private gameConfig: any, //gamification
   //     private gameParticipante: any, //gamification
        private router: Router,
    ) {
        // //gamification
        // if (navParams.get('participa') != undefined && navParams.get('participa') == true) {

        //     let loading = this.overlay.createLoading({ content: "Aguarde..." });
        //     loading.present();

        //     this.participaGame = navParams.get('participa');
        //     this.gameParticipante.carregar(() => {
        //         this.qtdComentarios = this.gameParticipante.getOpiniao();
        //     });

        //     this.carregaHashtags(() => {
        //         //--console.log("CARREGOU E SALVOU AQUI " + this.gameConfig.getHashtags());
        //         this.hashtags = this.gameConfig.getHashtags();
        //         loading.dismiss();
        //     }, () => {
        //         loading.dismiss();
        //     });

        //     //--console.log("---------" + navParams.get('participa'));

        //     this.participaGame = true;

        //     this.gameConfig.carregar(() => {
        //         if (this.gameConfig.existeDados()) {
        //             //--console.log("CARREGA HT");

        //             this.qtdParaDeGanhar = this.gameConfig.getQtdMaxOpiniaoGanha();
        //             this.qtdPerde = this.gameConfig.getQtdOpiniaoPerde();


        //         } else {
        //             this.participaGame = false;
        //         }
        //     });



        // } else {
        //     this.participaGame = false;
        // }
    }

  /**
   * Quando carrega a página pela primeira vez, configura a lista de opiniões para
   * ser atualizada sempre que se detectar reconexão de rede
   */
  ngOnInit() {

      // this.rede.observarConexao('opinioes-recarregar', () => {
      //     setTimeout(() => {
      //         this.atualizarLista();
      //     }, 1000);
      // });
      if (!this.config.tutorialFoiVisto(PassosTutorial.Opinioes)) {
          if(this.participaGame){
              this.passos = [
                  { el: this.tutCampo, msg: PassosMsgs[PassosTutorial.Opinioes][0] },
                  { el: this.tutAnonimo, msg: PassosMsgs[PassosTutorial.Opinioes][1] },
                  { el: this.tutHashtag, msg: PassosMsgs[PassosTutorial.Opinioes][2] }
              ];
          }else{
              this.passos = [
                  { el: this.tutCampo, msg: PassosMsgs[PassosTutorial.Opinioes][0] }
              ];
          }

          this.ativarTut = true;
      }
  }


  /**
   * Ao entrar na página, chama `atualizarLista` e vai até o fim da página
   */
  ionViewWillEnter() {
      this.atualizarLista();
      this.scrollToBottom();
      if (!this.config.tutorialFoiVisto(PassosTutorial.Opinioes)) {
          this.passos[0].el = this.tutCampo;
          if(this.participaGame){
              this.passos[1].el = this.tutAnonimo;
              this.passos[2].el = this.tutHashtag;
          }
          this.ativarTut = true;
      }

  }

  mostraTextoHashtags() {

    //if(this.texto[this.texto.length-1] == "#" || this.texto[this.texto.length-1] == "@"){

    let a = "";

    if (this.hashtags != undefined && this.hashtags != null) {

        //--console.log("TEM =" + JSON.stringify(this.hashtags));
        //--console.log("TEM =" + this.hashtags.length);
        //--console.log("TEM =" + JSON.stringify(this.hashtags[0].nome));
        this.hashtags.forEach(element => {
            //--console.log(element.nome + " - " + element.hashtag);
            a += "<b (click)=\"mostrarTextoHashtags=false\">" + element.hashtag + "</b> - " + element.nome + "<br>";
        });

        this.textoHashtags =
            "<html>" +
            a +
            "</html>";


        this.mostrarTextoHashtags = true;

    } else {
        //--console.log("NULL =" + this.hashtags);
    }
    //}
}

  /**
   * Atualiza a lista, marcando o horário e se já foi enviada
   */
  atualizarLista() {
    console.log('atualizar lista');
      this.listaOpinioes = [];
      for (let op of this.opinioes.getLista(this.evento.getID(), this.usuario.getID()))
          this.listaOpinioes.push({
              texto: op.texto,
              horaEnvio: DatasUtil.hora(op.horaEnvio) + ", " + DatasUtil.compacta(op.horaEnvio, true),
              enviada: op.enviada,
              anonimo: op.anonimo //gamification
          });
  }

  async mostraAlerta(titulo: string, subtitulo: string) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      subHeader: subtitulo,
      buttons: ['Ok']
    });
    await alert.present();
  }

enviaOpiniao() {
    if (this.participaGame) {
        //--console.log("qtdComentarios =" + this.qtdComentarios);
        //--console.log("qtdParaDeGanhar =" + this.qtdParaDeGanhar);
        //--console.log("qtdPerde =" + this.qtdPerde);

        this.confirmaEnvio();
        //this.gameParticipante.atualizarDados(() => { this.qtdComentarios = this.gameParticipante.getOpiniao(); });
    } else {
        this.enviar();
    }
}

async confirmaEnvio() {
    if (this.qtdComentarios > this.qtdParaDeGanhar) {
        if (this.qtdComentarios <= this.qtdPerde) {

          let alerta1  = await this.alertCtrl.create({
            header: 'Comentários excedidos!',
            subHeader: 'aso continue a enviar comentários, você começará a perder pontos de opinião ganhos até o momento!',
            buttons: [
              {
                  text: 'Confirmar',
                  handler: () => {
                      this.enviar();
                  }
              },

              {
                  text: 'Não Enviar',
                  handler: () => {

                  }
              }
          ]
          });
          await alerta1.present();
        }
        else {

          let alert = await this.alertCtrl.create({
            header: 'Comentários MUITO excedidos!',
            subHeader: 'Caso continue a enviar comentários, você sofrerá como penalidade a perda de pontos conseguidos com avaliações e questionários!',
            buttons: ['Ok']
          });
          await alert.present();


        }
    } else {
        this.enviar();
    }
}
///gamification

/**
 * Chamada ao clicar no botão de envio da opinião
 */
enviar() {
    let texto = this.texto.trim();
    let anonimo = this.anonimo; //gamification
    if (texto.length == 0) return;
    this.texto = "";

    this.overlay.createLoading("Enviando opinião..." );


    let aoObterResposta = () => {
        this.overlay.dismissAllLoaders();
        this.atualizarLista();
        this.scrollToBottom();

        // if (this.participaGame) {
        //     //this.ganhou = true; //mostra mensagem de parabens
        //     this.gameParticipante.atualizarDados();
        //     this.qtdComentarios++;
        // }
    }
    //gamification anonimo acrescentado como parametro da função
    this.opinioes.enviar(texto, this.usuario.getID(), this.evento.getID(), anonimo, aoObterResposta, () => {
        aoObterResposta();
        this.overlay.createAlert(
          "Falha na conexão",
          "Sua opinião será enviada quando possível.",
          "OK"
        )

    });
}


addTexto(a: string) {

  if (this.texto[this.texto.length - 1] == "#" || this.texto[this.texto.length - 1] == "@") {

      this.texto = this.texto.substring(0, this.texto.length - 1) + a;
  } else {
      this.texto += " " + a + " ";
  }

  this.mostrarTextoHashtags = false;

}


/**
 * Passa a página até seu final, após um pequeno intervalo de tempo
 */
scrollToBottom() {
  console.log('scrollToBottom');
    setTimeout(() => {
        this.content.scrollToBottom(0);
    }, 200);
}

/**
 * Chamada sempre que o usuário clica no tutorial
 * @param passo Passo do tutorial que foi visto
 */
viuTutorial(passo: any) {
    if (passo == -1 || passo == this.passos.length) {
        this.ativarTut = false;
        this.config.tutorialMarcarVisto(PassosTutorial.Opinioes);
    }
}



}
