import { Router } from '@angular/router';
import { ConfigService } from './../../services/config.service';
import { EstadoLista } from './../../enums/estado-lista.enum';
import { DatasUtil } from './../../utils/datas';
import { AtividadesService,AtivNoDiaInterface, AtividadeInterface } from './../../services/atividades.service';
import { EventoService } from './../../services/evento.service';
import { Component, OnInit, ViewChild} from '@angular/core';
import { IonSlides } from '@ionic/angular';

enum Aba { Agenda, Programacao }
@Component({
  selector: 'app-opcoes-enviar-perguntas',
  templateUrl: './opcoes-enviar-perguntas.page.html',
  styleUrls: ['./opcoes-enviar-perguntas.page.scss'],
})
export class OpcoesEnviarPerguntasPage implements OnInit {
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

  /** Variável para pegar o dia de hoje */
  hoje: string;

  /** Lista de todas atividades divididas por dia */
  listaPorDia: AtivNoDiaInterface[] = [];
  /** Versão filtrada da `listaPorDia` */
  listaFiltrada: AtivNoDiaInterface[] = [];

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



}


