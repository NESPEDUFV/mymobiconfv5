import { Router, NavigationExtras } from '@angular/router';
import { EstadoLista } from 'src/app/enums/estado-lista.enum';
import { QuestionarioPage } from './../questionario/questionario.page';
import { UsuarioService } from './../../services/usuario.service';
import { EventoService } from 'src/app/services/evento.service';
import { AtividadesService } from './../../services/atividades.service';
import { QuestionarioService, QuestionarioInterface } from './../../services/questionario.service';
import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-questionarios',
  templateUrl: './questionarios.page.html',
  styleUrls: ['./questionarios.page.scss'],
})
export class QuestionariosPage implements OnInit {

   /** @ignore */
   estadoLista = EstadoLista; //Disponibilizar enums para o HTML
   /** Estado de carregamento da lista */
   estado: EstadoLista;

   /** Lista completa dos questionários */
   listaQuestionarios: QuestionarioInterface[] = [];
   /** Lista filtrada dos questionários */
   listaFiltrada: QuestionarioInterface[] = [];
   /** Filtro de busca, entrada do usuário */
   filtroBusca: string;

   /**
    * Determina o estilo de cada marcador que fica ao lado do questionário.
    * Questionários enviados são marcados de verde, os alterados ficam de azul, e
    * os não enviados ficam cinza
    */
   marcadores: {
       [questID: string]: 'enviado' | 'alterado' | 'nao-enviado'
   } = {};

   /** @ignore */
   voltando: boolean = false; //Indica se está voltando para a página ou chegando nela
  /**
     * @param navCtrl Usado para mostrar a página de um questionário
     * @param evento Usado para adquirir o ID do evento
     * @param questionarios
     * @param usuario Usado para adquirir o ID do usuário
     * @param atividades Usado para determinar quais questionários serão exibidos
     */
   constructor(
    private router: Router,
    private navCtrl: NavController,
    private evento: EventoService,
    private questionarios: QuestionarioService,
    private usuario: UsuarioService,
    private atividades: AtividadesService
) { }


  ngOnInit() {
  }

    /**
     * Ao entrar na página, chama o método `carregar`
     */
     ionViewWillEnter() {
      this.carregar();
  }

  /**
   * Acessa a página de um questionário específico
   * @param quest Questionário a ser acessado
   */
  acessarQuest(quest: QuestionarioInterface) {
      this.voltando = true;

      let navigationExtras: NavigationExtras = {
        state: {
          quest: quest,
         }
        }

        this.router.navigate(['questionario'],navigationExtras);
  }

  /**
   * Carrega a lista de questionários, chamada também quando se puxa o refresher
   * @param refresher Refresher da página
   */
  carregar(refresher?) {
      const aoCarregar = () => {
          this.listaQuestionarios = this.questionarios.getLista().filter(quest => {
              this.marcadores[quest.ID] = this.marcador(quest.ID);
              return !quest.ativID || this.atividades.comecou(quest.ativID);
          });
          this.listaFiltrada = this.listaQuestionarios;
      }

      const carregar = () => {
          this.questionarios.buscar(this.evento.getID(), this.usuario.getID(), () => {
              aoCarregar();
              this.estado = EstadoLista.Sucesso;
              if (refresher) refresher.complete();
          }, () => {
              this.estado = EstadoLista.Falha;
              if (refresher) refresher.complete();
          });
      }

      if (this.voltando)
          aoCarregar();
      else {
          this.estado = EstadoLista.Carregando;
          this.atividades.disponivel(carregar, () => {
              this.atividades.buscar(this.evento.getID(), carregar);
          });
      }
  }

  /**
   * Filtra a lista de acordo com a entrada do usuário (filtra pelo nome do questionário e pelo nome da atividade)
   */
  filtrarLista() {
      this.listaFiltrada = this.listaQuestionarios;
      if (this.estado == EstadoLista.Sucesso && this.filtroBusca && this.filtroBusca.trim() != '') {
          this.listaFiltrada = this.listaFiltrada.filter((ev) => {
              return (ev.titulo.toLowerCase().indexOf(this.filtroBusca.toLowerCase()) > -1) ||
                  (ev.ativTitulo.toLowerCase().indexOf(this.filtroBusca.toLowerCase()) > -1);
          });
      }
  }

  /**
   * Informa qual marcador usar para um dado questionário
   * @param questID ID do questionário verificado
   */
  marcador(questID: string): 'enviado' | 'alterado' | 'nao-enviado' {
      if (this.questionarios.foiEnviado(questID))
          return 'enviado';
      else
          return (this.questionarios.getQtRespondidas(questID) > 0) ? 'alterado' : 'nao-enviado';
  }

}
