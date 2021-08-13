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

  ionViewWillEnter() {
    this.isOnline  = this.evento.getIsOnline();
    if (!this.voltando) { //Entrando na página, carrega a lista de atividades
        this.abaSelecionada = Aba.Programacao;
        this.carregar();
    } else { //Se estiver apenas voltando, só atualiza com a lista já carregada, mantendo o filtro de busca
        this.listaPorDia = this.atividades.listarPorDia();
        this.copiarLista();
    }
}

/**
 * Acessa a página de informação de uma atividade
 * @param ativ Atividade a ser acessada
 */
acessarRanking(ativ?: AtividadeInterface) {
    this.voltando = true;
    if(ativ){
      //falta incluir extras
      this.router.navigate(['ranking-perguntas']);
      //this.navCtrl.push(RankingPerguntasPage, { ativ: ativ });
    }else{
      //Esse aqui não tem navigation extras
      this.router.navigate(['ranking-perguntas']);
      //this.navCtrl.push(RankingPerguntasPage);
    }

}

/**
 * Carrega a lista de atividades do armazenamento local, ou busca online caso não encontre
 */
carregar() {
    this.estado = EstadoLista.Carregando;
    this.diaSelecionado = "-";
    let aoCarregar = () => {
        this.abaSelecionada = Aba.Programacao;
        this.mudouAba();
        //this.mudouDia();
        this.estado = EstadoLista.Sucesso;
        setTimeout(() => {
            this.slidesDias.slideTo(this.indexDiaSlides(), 500);

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
    /*
    if (index == this.slidesDias.length())
        index--;
*/
    this.hoje = DatasUtil.compacta(hoje, true);;
    return index;
}

/**
 * Quando o usuário muda a aba, atualiza a lista
 */
mudouAba() {
    this.listaPorDia = this.atividades.listarPorDia();
    this.copiarLista();
}

/**
 * Quando o usuário muda o dia, atualiza o título do dia selecionado

mudouDia() {
    let iDia = this.slidesDias.getActiveIndex();
    if (iDia < 0)
        iDia = 0;
    else if (iDia >= this.slidesDias.length())
        iDia = this.slidesDias.length() - 1;
    if (this.listaPorDia.length > 0)
        this.diaSelecionado = DatasUtil.compacta(this.listaPorDia[iDia].data, true);
    else
        this.diaSelecionado = "-";
}

/**
 * Copia a lista original para a `listaFiltrada`
 */
copiarLista() {
    this.listaFiltrada = [];
    for (let dia of this.listaPorDia)
        this.listaFiltrada.push({ data: dia.data, ativ: dia.ativ });
}


}


