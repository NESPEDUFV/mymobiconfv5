import { VotosService } from './../../services/votos.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { PerguntasService,RankingPerguntasInterface } from './../../services/perguntas.service';
import { UsuarioService } from './../../services/usuario.service';
import { AtividadeInterface } from './../../services/atividades.service';
import { EstadoLista } from './../../enums/estado-lista.enum';
import { EventoService } from './../../services/evento.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-ranking-perguntas',
  templateUrl: './ranking-perguntas.page.html',
  styleUrls: ['./ranking-perguntas.page.scss'],
})
export class RankingPerguntasPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;
  //Disponibilizar enum para o HTML
    /** @ignore */
    enumEstado = EstadoLista;

    /** Lista das perguntas */
    lista: RankingPerguntasInterface[];
    /** Estado do carregamento da lista */
    estado: EstadoLista = EstadoLista.Carregando;
    /** Atividade cujas informações serão exibidas */
    atividade: AtividadeInterface;
    /** id user */
    id_user: string
    /** favorito */
    favorito: number

    hasScrollbar = true;

     /**
     * @param perguntas Usado para acessar as perguntas
     * @param evento Usado para adquirir o ID do evento
     * @param toastCtrl Mostra toasts de aviso
     * @param ativ Usado para adquirir o ID da atividade
     */

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastCtrl: ToastController,
    private perguntas: PerguntasService,
    private usuario: UsuarioService,
    private evento: EventoService,
    private votos: VotosService
  ) {
    /**
     * Ao entrar na página, chama o método `carregar`
     */
    this.route.queryParams.subscribe(params => {
      if(this.router.getCurrentNavigation().extras.state){
        console.log('has extras', this.router.getCurrentNavigation().extras);
        this.atividade = this.router.getCurrentNavigation().extras.state.ativEscolhida;
      }
    });
    this.carregar();
      this.id_user = this.usuario.getID();
  }

  ngOnInit() {

  }

//   /**
//      * Ao entrar na página, chama o método `carregar`
//      */
//    ionViewWillEnter() {
//     //this.atividade = this.navParams.get('ativ');
//     this.carregar();
//     this.id_user = this.usuario.getID();
// }

/**
 * Carrega a lista de perguntas, também chamada ao se puxar o refresher
 * @param refresher Refresher da página
 */
carregar(refresher?) {
  console.log('atividade: ', this.atividade);
    this.estado = EstadoLista.Carregando;
    if(this.atividade){
      console.log("atividade: ",this.atividade);
        this.perguntas.buscar(this.evento.getID(),this.usuario.getID(),this.atividade.ID, () => {
            this.lista = this.perguntas.getLista();
            this.estado = EstadoLista.Sucesso;
            console.log("lista: ",this.lista);

            if (refresher) refresher.complete();
        }, () => {
            this.estado = EstadoLista.Falha;
            if (refresher) refresher.complete();
        });
    }else{
        this.perguntas.buscar(this.evento.getID(),this.usuario.getID(),"0", () => {
            this.lista = this.perguntas.getLista();
            this.estado = EstadoLista.Sucesso;
            console.log("lista: ",this.lista);
            if (refresher) refresher.complete();
        }, () => {
            this.estado = EstadoLista.Falha;
            if (refresher) refresher.complete();
        });
    }
  }

  getContent() {
    console.log('oi');
    return document.querySelector('ion-content');
  }

  scrollToBottom(){
    this.hasScrollbar = false;
    this.getContent().scrollToBottom(500);
    }





    /**
   * Acessa a página de envio de perguntas
   * @param ativ Atividade a ser acessada
   */
    acessarEnviar(ativ?: AtividadeInterface) {
      if(ativ){
        let navigationExtras: NavigationExtras = {
          state: {
            ativEscolhida: ativ
            }
          }
        this.router.navigate(['enviar-pergunta'],navigationExtras)

      }else{
        this.router.navigate(['enviar-pergunta'])
      }

  }

    /**
 * curte uma pergunta
 * @param pergunta pergunta a ser curtida
 */
    enviarVoto(pergunta: RankingPerguntasInterface){
      this.votos.enviarVoto(pergunta.id_pergunta, this.usuario.getID());

      setTimeout(() => {
          let toastSucesso = this.toastCtrl.create({
              message: "Voto adicionado com sucesso!",
              duration: 1500,
              position: 'bottom'
          });
          let toastConflito = this.toastCtrl.create({
              message: "Voto removido com sucesso!",
              duration: 1500,
              position: 'bottom'
          });

          /*
          if (pergunta.votou == 0){
              toastSucesso.present();
              pergunta.votou = 1;
              pergunta.qtd_votos = (1+parseInt(pergunta.qtd_votos)).toString();
              //pergunta.favorito= parseInt(pergunta.qtd_votos);
          }else if (pergunta.votou == 1){
              toastConflito.present();
              pergunta.votou = 0;
              pergunta.qtd_votos  = (-1+parseInt(pergunta.qtd_votos)).toString();
              //pergunta.favorito= parseInt(pergunta.qtd_votos);
          }
          */
      }, 100);

  }



}
