import { ConfigService } from './../../services/config.service';
import { AtividadeInterface, AtividadesService } from './../../services/atividades.service';
import { EventoService } from './../../services/evento.service';
import { NavigationExtras, Router } from '@angular/router';
import { EstadoLista } from './../../enums/estado-lista.enum';
import { IonSlides } from '@ionic/angular';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PassosTutorial, PassosMsgs } from '../../components/tutorial/passos';
import { AtivNoDiaInterface } from 'src/app/services/atividades.service';
//import Swiper from 'swiper';

enum Aba { Agenda, Programacao }

@Component({
  selector: 'app-atividades',
  templateUrl: './atividades.page.html',
  styleUrls: ['./atividades.page.scss'],
})
export class AtividadesPage implements OnInit {
   /** @ignore */
   @ViewChild('alternar', { read: ElementRef }) alternar: ElementRef;
   /** @ignore */
   @ViewChild('botoes', { read: ElementRef }) botoes: ElementRef;
   /** @ignore */
   @ViewChild('lista', { read: ElementRef }) lista: ElementRef;
   /** Controla quando o tutorial é ativado */
   ativarTut: boolean = false;
   /** Passos do tutorial desta página */
   passos: { el: ElementRef, msg: string }[] = [];

   /** Slides que separam os dias das atividades */
   @ViewChild(IonSlides) slidesDias: IonSlides;
   //Disponibilizar os enums ao HTML
   /** @ignore */
   estadoLista = EstadoLista;
   /** @ignore */
   aba = Aba;

   /** Evento o qual a atividade pertence, para verificar se é online ou presencial */
   isOnline: number;

   /** Estado de carregamento da lista */
   estado: EstadoLista;
   /** @ignore */
   voltando: boolean = false; //Indica se está voltando para a página (true) ou entrando nela (false)

   /** Indica a aba selecionada */
   abaSelecionada: Aba;
   /** Versão formatada do dia selecionado */
   diaSelecionado: string;

   /** Filtro de busca digitado pelo usuário, usado para filtrar as atividades mostradas na lista */
   filtroBusca: string;

   /** Lista de todas atividades divididas por dia */
   listaPorDia: AtivNoDiaInterface[] = [];
   /** Versão filtrada da `listaPorDia` */
   listaFiltrada: AtivNoDiaInterface[] = [];

   sliderOne: any;
  sliderTwo: any;
  sliderThree: any;

   /**
    * @param router Usado para mostrar outras páginas
    * @param evento Usado para adquirir o ID do evento
    * @param atividades
    * @param config Usado para o tutorial
    */

  constructor(
    private router: Router,
    private evento: EventoService,
    private atividades: AtividadesService,
    private config: ConfigService
  ) { }

  ngOnInit() {
  }

  /**
     * Ao entrar na página, chama o método `carregar` se necessário
     */
   ionViewWillEnter() {
    this.isOnline  = this.evento.getIsOnline();
    if (!this.voltando) { //Entrando na página, carrega a lista de atividades
        this.abaSelecionada = Aba.Agenda;
        this.carregar();
    } else { //Se estiver apenas voltando, só atualiza com a lista já carregada, mantendo o filtro de busca
        this.listaPorDia = this.atividades.listarPorDia(this.abaSelecionada == Aba.Agenda);
        this.copiarLista();
        this.filtrarLista();
    }
  }

   /**
     * Acessa a página de informação de uma atividade
     * @param ativ Atividade a ser acessada
     */
    acessarAtividade(ativ: AtividadeInterface) {
      this.voltando = true;

      let navigationExtras: NavigationExtras = {
        state: {
           ativ: ativ,
         }
        }

      this.router.navigate(['atividade-info'], navigationExtras);
  }

  /**
   * Carrega a lista de atividades do armazenamento local, ou busca online caso não encontre
   */
  carregar() {
      this.estado = EstadoLista.Carregando;
      this.diaSelecionado = "-";
      let aoCarregar = () => {
          this.abaSelecionada = (this.atividades.temAlgoAgendado()) ? Aba.Agenda : Aba.Programacao;
          // this.mudouAba();
          // this.mudouDia();
          this.estado = EstadoLista.Sucesso;
          setTimeout(() => {
              this.slidesDias.slideTo(this.indexDiaSlides(), 500);
              //Preparar o tutorial
              if (!this.config.tutorialFoiVisto(PassosTutorial.Atividades)) {
                  this.passos = [
                      { el: this.alternar, msg: PassosMsgs[PassosTutorial.Atividades][0] },
                      { el: this.botoes, msg: PassosMsgs[PassosTutorial.Atividades][1] },
                      { el: this.lista, msg: PassosMsgs[PassosTutorial.Atividades][2] }
                  ];
                  this.ativarTut = true;
              }
          }, 200);
      }

      this.atividades.disponivel(aoCarregar, () => {
          this.atividades.buscar(this.evento.getID(), aoCarregar, () => {
              this.listaPorDia = [];
              this.listaFiltrada = [];
              this.estado = EstadoLista.Falha;
          });
      });
  }

  /**
   * Procura pelo dia mais próximo do dia corrente e retorna o índice dos slides correspondente a esse dia
   * @returns Índice dos slides mais próximo do dia corrente
   */
  indexDiaSlides(): number {
      let hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      let index = 0;

      for (let dia of this.listaPorDia)
          if (hoje > dia.data)
              index++;
          else
              break;

      // if (index == this.slidesDias.length())
      //     index--;

      return index;
  }

  /**
   * Filtra a lista de atividades quando o usuário digita algo
   */
  filtrarLista() {
      let filtro = this.filtroBusca && this.filtroBusca.trim();
      if (filtro && filtro != "") {
          for (let i in this.listaPorDia) {
              this.listaFiltrada[i].ativ = this.listaPorDia[i].ativ.filter((ev) => {
                  return (ev.titulo.toLowerCase().indexOf(filtro.toLowerCase()) > -1) ||
                      (ev.local.toLowerCase().indexOf(filtro.toLowerCase()) > -1);
              });
          }
      } else
          this.copiarLista();
  }

  /**
   * Quando o usuário muda a aba, atualiza a lista
   */
  mudouAba(event: any) {
      this.listaPorDia = this.atividades.listarPorDia(this.abaSelecionada == Aba.Agenda);
      this.copiarLista();
      this.filtroBusca = "";
  }

  /**
   * Quando o usuário muda o dia, atualiza o título do dia selecionado
   */
  mudouDia(t1:any,t2:any) {
      // let iDia = this.slidesDias.getActiveIndex();
      // if (iDia < 0)
      //     iDia = 0;
      // else if (iDia >= this.slidesDias.length())
      //     iDia = this.slidesDias.length() - 1;
      // if (this.listaPorDia.length > 0)
      //     this.diaSelecionado = DatasUtil.compacta(this.listaPorDia[iDia].data, true);
      // else
      //     this.diaSelecionado = "-";
  }

  /**
   * Copia a lista original para a `listaFiltrada`
   */
  copiarLista() {
      this.listaFiltrada = [];
      for (let dia of this.listaPorDia)
          this.listaFiltrada.push({ data: dia.data, ativ: dia.ativ });
  }

  /**
   * Chamada sempre que o usuário clica no tutorial
   * @param passo Passo do tutorial que foi visto
   */
  viuTutorial(passo: number) {
      if (passo == -1 || passo == this.passos.length) {
          this.ativarTut = false;
          this.config.tutorialMarcarVisto(PassosTutorial.Atividades);
      }
  }


}
