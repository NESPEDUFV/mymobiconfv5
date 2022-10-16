import { ConnectivityProvider } from './../../services/rede2.service';
import { RedeService } from './../../services/rede.service';
import { EnviarPerguntaService } from './../../services/enviar-pergunta.service';
import { AtividadeInterface } from './../../services/atividades.service';
import { OverlayService } from './../../services/overlay.service';
import { EventoService } from 'src/app/services/evento.service';
import { UsuarioService } from './../../services/usuario.service';
import { Router, NavigationExtras } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, AlertController } from '@ionic/angular';
import { Plugins, NetworkStatus, PluginListenerHandle } from '@capacitor/core';


const { Network } = Plugins;


@Component({
  selector: 'app-enviar-pergunta',
  templateUrl: './enviar-pergunta.page.html',
  styleUrls: ['./enviar-pergunta.page.scss'],
})
export class EnviarPerguntaPage implements OnInit {
    /** `ion-content` da página */
    /** @ignore */
    @ViewChild(IonContent) content: IonContent;
    /** Atividade cujas perguntas serão exibidas */
    atividade: AtividadeInterface;

    /** Lista de opiniões */
    private listaEnviarPergunta: {
        pergunta: string
        enviada: boolean
    }[] = [];
    /** Entrada de pergunta do usuário */
    pergunta: string = "";

    private anonimo: boolean = true;


    /**
     * @param overlay
     * @param perguntas
     * @param usuario Usado para adquirir o ID do usuário
     * @param evento Usado para adquirir o ID do evento
     * @param rede Usado para configurar atualização da lista
     */


  constructor(private connectivityProvider: ConnectivityProvider,
              private overlay: OverlayService,
              private perguntas: EnviarPerguntaService,
              private usuario: UsuarioService,
              private evento: EventoService,
              private alertCtrl: AlertController,
              private router : Router
              )
   { }


  /** verificação de conectividade agora é feita com um Observable */
  ngOnInit() {
    this.connectivityProvider.appIsOnline$.subscribe(online => {

      console.log(online)

      if (online) {

          // call functions or methods that need to execute when app goes online (such as sync() etc)
          /**
            * Quando carrega a página pela primeira vez, configura a lista de opiniões para
            * ser atualizada sempre que se detectar reconexão de rede
          */
           this.connectivityProvider.observarConexao('perguntas-recarregar', () => {
            setTimeout(() => {
                this.atualizarLista();
            }, 1000);
        });
      } else {

          // call functions on network offline, such as firebase.goOffline()

      }

  })

  }

  /**
     * Atualiza a lista, marcando o horário e se já foi enviada
     */
   atualizarLista() {
    this.listaEnviarPergunta = [];
    if(this.atividade){
        for (let op of this.perguntas.getLista(this.evento.getID(), this.usuario.getID(), this.atividade.ID))
        this.listaEnviarPergunta.push({
            pergunta: op.pergunta,
            enviada: op.enviada
        });
    }else{
        for (let op of this.perguntas.getLista(this.evento.getID(), this.usuario.getID()))
        this.listaEnviarPergunta.push({
            pergunta: op.pergunta,
            enviada: op.enviada
        });
    }

  }


 async mostraAlerta(titulo: string, subtitulo: string) {
  const alert = await this.alertCtrl.create({
    header: titulo,
    subHeader: subtitulo,
    buttons: ['Ok']
  });
  await alert.present();
}

enviaPergunta() {
    this.enviar();
}

confirmaEnvio() {
    this.enviar();
}
///gamification

/**
 * Chamada ao clicar no botão de envio da opinião
 */
enviar() {
    let pergunta = this.pergunta.trim();
    if (pergunta.length == 0) return;
    this.pergunta = "";

    let loading = this.overlay.createLoading("Enviando pergunta..." );


    let aoObterResposta = () => {
      this.overlay.dismissAllLoaders();
        //loading.dismiss();
        this.atualizarLista();
        this.scrollToBottom();

    }
    if(this.atividade){
        this.perguntas.enviar(pergunta, this.usuario.getID(), this.evento.getID(), this.atividade.ID, aoObterResposta, () => {
            aoObterResposta();
            this.overlay.createAlert(
                "Falha na conexão",
                "Sua pergunta será enviada quando possível.",
                "OK"
            );
        });
    }else{
        this.perguntas.enviar(pergunta, this.usuario.getID(), this.evento.getID(), "0", aoObterResposta, () => {
            aoObterResposta();
            this.overlay.createAlert(
                "Falha na conexão",
                "Sua pergunta será enviada quando possível.",
                "OK"
            );
        });
    }

}

  /**
     * Passa a página até seu final, após um pequeno intervalo de tempo
     */
   scrollToBottom() {
    setTimeout(() => {
        this.content.scrollToBottom();
    }, 200);
}

}


