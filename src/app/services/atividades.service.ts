import { HITree } from './../utils/hi-tree';
import { DatasUtil } from './../utils/datas';
import { ServidorService } from './servidor/servidor.service';
import { ArmazenamentoService } from './armazenamento.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';






/** Dados de uma atividade */
export interface AtividadeInterface {
  /** ID da atividade */
  ID: string
  /** Tipo da atividade */
  tipo: string
  /** Título da atividade */
  titulo: string
  /** Tema da atividade */
  tema: string
  /** Descrição da atividade */
  descricao: string
  /** Horário em que a atividade começa */
  horaInicio: Date
  /** Horário em que a atividade termina */
  horaFim: Date
  /** Quem é o responsável pela atividade */
  responsavel: string
  /** Local da atividade */
  local: string
  /** Link para acesso da atividade */
  link_principal: string
  /** Logradouro da atividade */
  logradouro: string
  /** Se a atividade está na agenda */
  estaNaAgenda: boolean
  /** define se mostra ou não a notificação */
  mostraNotif: boolean
}

/** Array de atividades com seu dia */
export interface AtivNoDiaInterface {
  /** Dia em que ocorre a lista de atividades */
  data: Date
  /** Lista de atividades ocorrendo no dia */
  ativ: AtividadeInterface[]
}

@Injectable({
  providedIn: 'root'
})
export class AtividadesService {
  /** Armazena a lista de atividades */
  private atividades: HITree<AtividadeInterface> = null;

  constructor(private storage: ArmazenamentoService, private servidor: ServidorService) { }

    /**
     * Salva as atividades no armazenamento local
     */
  salvar() {
    this.storage.set('atividades', JSON.stringify(this.atividades));
  }

  /**
   * Carrega as atividades do armazenamento local
   * @param sucessoCb Callback para ser executada quando termina de carregar e têm dados salvos
   * @param falhaCb Callback para ser execitada quando temrmina de carregar e não há dados
   */
  carregar(sucessoCb?: () => void, falhaCb?: () => void) {
    console.log("não tem storage get: ", this.storage.get('atividades'));
    console.log("sucesso: ", sucessoCb);
    console.log("falha: ", falhaCb);
      this.storage.get('atividades').then((val) => {
          if (val && JSON.parse(val)) {
            console.log('val: ', val);
            this.atividades = this.criarArvore(val);

            if (sucessoCb) {
              console.log("passou storage, sucessoCb: ", sucessoCb);
              sucessoCb();
            }

          } else
              if (falhaCb) falhaCb();
      })
  }

  /**
   * Apaga as atividades, inclusive do armazenamento local
   */
  apagar() {
      if (!this.atividades) return;
      this.atividades.clear();
      this.atividades = null;
      this.salvar();
  }

  /**
   * Informa se existem dados das atividades
   * @returns Se existem dados das atividades
   */
  existeDados(): boolean {
      return this.atividades != null;
  }

  /**
   * Executa uma dada ação após garantir que as atividades foram carregadas
   * @param sucessoCb Callback executada após garantir que as atividades foram carregadas
   * @param falhaCb Callback executada após falha no carregamento das atividades
   */
  disponivel(sucessoCb: () => void, falhaCb?: () => void) {
    console.log("inicio disponiel");
      if (this.existeDados()){
        console.log("exite dados");
        sucessoCb();
      }
      else{
        console.log("não existe dados");
        this.carregar(sucessoCb, falhaCb);
      }
      console.log("fim disponiel");
  }
  getAtividadesEvento(eventoId: string): Observable<any> {
    return this.servidor.atividades.buscar(eventoId);
  }

  /**
   * Busca as atividades do servidor
   * @param eventoID ID do evento cujas atividades serão carregadas
   * @param sucessoCb Callback chamada quando consegue carregar as atividades
   * @param falhaCb Callback chamada quando as outras alternativas falham
   */
  buscar(eventoID: string, sucessoCb?: () => void, falhaCb?: () => void) {
    console.log("BUSCAAAAAAAAAAAAAR");
      this.servidor.atividades.buscar(eventoID).subscribe((data: any) => {
        console.log("buscando data: ", data);
          this.atividades = this.formatarLista((data && data.atividades) ? data.atividades : []);
          this.salvar();
          if (sucessoCb) sucessoCb();
      }, () => { if (falhaCb) falhaCb() });
  }

  /**
   * Cria array associativa formatada das atividades para padronização dentro do app
   * @param atividades Array de atividades
   * @returns Array associativa das atividadades formatadas
   */
  private formatarLista(atividades: any[]): HITree<AtividadeInterface> {
      let arvore = this.criarArvore();
      for (let ativ of atividades)
          arvore.add(this.formatarObj(ativ));
      return arvore;
  }

  /**
   * Converte formato de data e hora do servidor para Date
   * @param dia Dia da atividade no formato do servidor
   * @param hora Hora da atividade no formato do servidor
   * @returns Objeto do tipo Date convertido
   */
  private formatarHora(dia: string, hora: string): Date {
      let data = new Date(dia.replace(/-/g, "/"));
      data.setHours(+hora.match(/\d+/g)[0], +hora.match(/\d+/g)[1], +hora.match(/\d+/g)[2]);
      return data;
  }

  /**
   * Adequa o formato do objeto de uma atividade para padronização dentro do app
   * @param atividade Atividade no formato do servidor
   * @returns Atividade formatada
   */
  private formatarObj(atividade: any): AtividadeInterface {
      return {
          ID: atividade.ID,
          tipo: atividade.tipo,
          titulo: atividade.Nome,
          tema: atividade.Tema,
          descricao: atividade.Descricao,
          horaInicio: this.formatarHora(atividade.Data, atividade.Hora_inicio),
          horaFim: this.formatarHora(atividade.Data, atividade.Hora_fim),
          responsavel: atividade.responsavel,
          local: atividade.local,
          link_principal: atividade.link_principal,
          logradouro: atividade.logradouro,
          estaNaAgenda: false,
          mostraNotif: false
      };
  }

  /**
   * Cria uma árvore de atividades
   * @param json String no formato JSON que representa uma árvore
   */
  private criarArvore(json?: string): HITree<AtividadeInterface> {
      let arvore = new HITree<AtividadeInterface>(
          ativ => ativ.ID,
          ativ => ativ.horaInicio.getTime(),
          ativ => ativ.horaFim.getTime(),
          json
      );
      if (json) {
          let h: any; // Converter : string -> Date
          arvore.forEach(ativ => {
              h = ativ.horaInicio;
              ativ.horaInicio = new Date(h);
              h = ativ.horaFim;
              ativ.horaFim = new Date(h);
          });
      }
      return arvore;
  }

  /**
   * @param id ID da atividade buscada
   * @returns Atividade referente ao ID passado
   */
  getAtividadePorID(id: string): AtividadeInterface {
      if (this.atividades)
          return this.atividades.getByID(id);
      else
          null;
  }

  /**
   * @param id ID da atividade verificada
   * @returns Se a atividade está na agenda
   */
  estaNaAgenda(id: string): boolean {
      if (this.atividades) {
          let ativ = this.atividades.getByID(id);
          return ativ ? ativ.estaNaAgenda : false;
      } else
          return false;
  }

  /**
   * Informa se existe alguma atividade agendada
   * @returns Se existe alguma atividade agendada
   */
  temAlgoAgendado(): boolean {
      if (this.atividades)
          return this.atividades.some(ativ => ativ.estaNaAgenda);
      else
          return false;
  }

  /**
   * @param id ID da atividade
   * @returns Se está dentro do horário de uma dada atividade
   */
  estaNaHora(id: string): boolean {
      if (this.atividades) {
          let ativ = this.atividades.getByID(id);
          return ativ ? DatasUtil.estaNaHora(ativ.horaInicio, ativ.horaFim) : false;
      } else
          return false;
  }

  /**
   * @param id ID da atividade
   * @returns Se passou da hora de início da atividade
   */
  comecou(id: string): boolean {
      if (this.atividades) {
          let ativ = this.atividades.getByID(id);
          return ativ ? DatasUtil.estaNaHora(ativ.horaInicio) : false;
      } else
          return false;
  }

  /**
   * Adiciona ou remove da agenda uma atividade (pode haver conflito)
   * @param id ID da atividade a ser adicionada à agenda
   * @param permitirConflito Se pode haver conflito de horário entre atividades
   * @returns Se pôde colocar a atividade na agenda
   */
  agendar(id: string, permitirConflito: boolean): boolean {
      if (this.atividades) {
          let ativ = this.atividades.getByID(id);
          if (!ativ) return false;
          if (!permitirConflito && !ativ.estaNaAgenda && this.verificarConflito(id))
              return false;
          else {
              ativ.estaNaAgenda = !ativ.estaNaAgenda;
              ativ.mostraNotif = true;
              this.salvar();
              return true;
          }
      } else
          return false;
  }

  /**
   * @returns Array com todas as atividades em ordem cronológica
   */
  listarEmOrdem(): AtividadeInterface[] {
      if (!this.atividades) return [];
      let lista: AtividadeInterface[] = [];
      this.atividades.forEach(ativ => lista.push(ativ));
      return lista;
  }

  /**
   * @param agenda Se deve incluir apenas as atividades agendadas
   * @returns Array cujos elementos representam os dias e que são arrays das atividades naquele dia
   */
  listarPorDia(agenda?: boolean): AtivNoDiaInterface[] {
      if (!this.atividades) return [];
      let listaPorDia: AtivNoDiaInterface[] = [];
      let listaOrdenada = this.listarEmOrdem();
      if (listaOrdenada.length <= 0) return [];

      let dia: Date = new Date(listaOrdenada[0].horaInicio.getTime());
      dia.setHours(0, 0, 0, 0);
      let i: number = 0;
      listaPorDia.push({ data: dia, ativ: [] });

      for (let ativ of listaOrdenada) {
          let inicio: Date = new Date(ativ.horaInicio.getTime());
          inicio.setHours(0, 0, 0, 0);
          if (inicio.getTime() != dia.getTime()) {
              dia = inicio;
              listaPorDia.push({ data: dia, ativ: [] });
              i++;
          }
          if (!agenda || ativ.estaNaAgenda)
              listaPorDia[i].ativ.push(ativ);
      }

      return listaPorDia;
  }

  /**
   * Lista todas as atividades agendadas, em ordem cronológica
   * @param agora Limita para mostrar apenas as agendadas no momento corrente
   * @returns Lista de atividades agendadas
   */
  listarAgendadas(agora?: boolean): AtividadeInterface[] {
      if (this.atividades) {
          if (agora)
              return this.atividades.getByPoint(Date.now(), DatasUtil.MargemErroTempo).filter(ativ =>
                  ativ.estaNaAgenda);
          else
              return this.atividades.filter(ativ => ativ.estaNaAgenda);
      } else
          return [];
  }

  /**
   * @param id ID da atividade a ser conferida
   * @returns Se há conflito entre uma atividade e qualquer outra da lista
   */
  verificarConflito(id: string): boolean {
      if (!this.atividades) return false;
      let ativ = this.atividades.getByID(id);
      if (!ativ) return false;
      return this.atividades.getByInterval(ativ.horaInicio.getTime(), ativ.horaFim.getTime(), true)
          .filter(ativ => ativ.estaNaAgenda).length > 0;
  }





}
