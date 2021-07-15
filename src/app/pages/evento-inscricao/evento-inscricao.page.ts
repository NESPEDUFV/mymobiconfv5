import { ParceirosService } from './../../services/parceiros.service';
import { FirebaseService } from './../../services/firebase/firebase.service';
import { NotificacoesService } from './../../services/notificacoes.service';
import { NoticiaService } from './../../services/noticia.service';
import { AtividadesService } from './../../services/atividades.service';
import { HITree } from './../../utils/hi-tree';
import { UsuarioService } from './../../services/usuario.service';
import { EventoService, EventoInterface } from 'src/app/services/evento.service';
import { DatasUtil } from './../../utils/datas';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-evento-inscricao',
  templateUrl: './evento-inscricao.page.html',
  styleUrls: ['./evento-inscricao.page.scss'],
})
export class EventoInscricaoPage implements OnInit {

  info: any;
  /** Evento cujas informações serão exibidas */
  eventoEscolhido: EventoInterface;
  /** Versões formatadas das datas de início e fim do evento */
  data = { inicio: "-", fim: "-" };
  /** Se o usuário vai se desinscrever caso aperte o botão da página */
  desinscrever: boolean;
  /** Verifica a se o evento possui gamificação */
  gamificacao: number = 0;


   /**
     * @param router Usado para voltar à página principal
     * @param navParams Usado para adquirir os dados passados como parâmetro a esta página
     * @param toastCtrl
     * @param evento
     * @param usuario Usado para adquirir o ID do usuário
     * @param atividades Usado para apagar os dados anteriores das atividades
     * @param parceiros Usado para apagar os dados anteriores dos parceiros
     * @param noticias Usado para apagar os dados anteriores das notícias
     * @param notif Usado para apagar os dados anteriores das notificações
     */

  constructor(

    private toastCtrl: ToastController,
    private evento: EventoService,
    private usuario: UsuarioService,
    private atividades: AtividadesService,
    private parceiros: ParceirosService,
    private noticias: NoticiaService,
    private notif: NoticiaService,
    private firebase: FirebaseService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      console.log(this.router.getCurrentNavigation().extras.state);
      if(this.router.getCurrentNavigation().extras.state){
        console.log("has extras");
        this.eventoEscolhido = this.router.getCurrentNavigation().extras.state.eventoEscolhido;
        this.desinscrever = this.router.getCurrentNavigation().extras.state.desinscrever;
      }
    })

  }

  /**
     * Ao entrar na página, carrega os dados a serem exibidos
     */

 ionViewWillEnter() {


  //this.eventoEscolhido = this.navParams.get('eventoEscolhido');
  //this.desinscrever = this.navParams.get('desinscrever');
  this.data.inicio = DatasUtil.completa(this.eventoEscolhido.dataInicio);
  this.data.fim = DatasUtil.completa(this.eventoEscolhido.dataFim);
  this.gamificacao = this.eventoEscolhido.gamificacao;
  console.log("Has gamification: "+ this.eventoEscolhido.gamificacao)
}

   /**
     * Se inscreve/desinscreve num/de um evento
     */
    inscrever() {
      this.atividades.apagar();
      this.noticias.apagar();
      this.notif.apagar();
      this.parceiros.apagar();
      if (this.desinscrever)
          this.evento.inscrever(null);
      else
          this.evento.inscrever(this.eventoEscolhido, this.usuario.getID(),this.firebase.getIdDispositivo());

      this.toastCtrl.create({
          message: (this.desinscrever ? "Des" : "I") + "nscrito com sucesso!",
          duration: 1000,
          position: "bottom"
      });
      this.router.navigate(['my-mobi-conf']);
  }

  ngOnInit() {
  }


}
