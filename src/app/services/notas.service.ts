import { ArmazenamentoService } from './armazenamento.service';
import { ServidorService } from './servidor/servidor.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TipoNota } from '../enums/tipo-nota.enum';
import { LinkedList } from '../utils/linked-list';
import { DatasUtil } from '../utils/datas';


/** Dados necessários para fazer o reenvio das notas */
interface NotaEnvioInterface {
  /** Notas dadas a uma atividade, nesta ordem: [Conforto térmico, conforto sonoro, avaliação geral] */
  notas: number[]
  /** ID da atividade a que se destinam as notas dadas */
  ativID: string
  /** ID do evento da atividade */
  eventoID: string
  /** ID do usuário que votou */
  usuarioID: string
  /** Hora de início da atividade a que se destinam as notas */
  horaInicio: string
  /** Hora do fim da atividade a que se destinam as notas */
  horaFim: string
}

/** Dados para observar envio de nota */
export interface NotaInterface {
  /** Tipo da nota (Conforto térmico | Conforto sonoro | Avaliação geral) */
  tipo: TipoNota
  /** Valor da nota */
  nota: number
  /** ID da atividade a que se destinam as notas dadas */
  ativID: string
  /** ID do evento da atividade */
  eventoID: string
  /** ID do usuário que votou */
  usuarioID: string
}

/**
 * Responsável por armazenar as notas de avaliação das atividades e gerenciar seu envio
 */
@Injectable({
  providedIn: 'root'
})
export class NotasService {

  /** Armazenamento das notas para cada atividade */
  private notas: { [ID: string]: number[] };
  /** Lista de notas a ser enviadas */
  private notasEnviar: LinkedList<NotaEnvioInterface>;
  /** Permite observar quando um envio de nota é realizado */
  private envio: Subject<NotaInterface>;
  /** @ignore */
  private _carregou: boolean = false;

  constructor(
    private servidor: ServidorService,
    private storage: ArmazenamentoService
  ) {
    this.notas = {};
    this.notasEnviar = new LinkedList<NotaEnvioInterface>();
    this.envio = new Subject<NotaInterface>();
  }

  /**
    * Salva no armazenamento local as notas registradas
    */
  salvar() {
    this.storage.set('notas', JSON.stringify(this.notas));
    this.storage.set('notas-enviar', JSON.stringify(this.notasEnviar.toArray()));
  }

  /**
    * Carrega do armazenamento local as notas registradas
    * @param cb Callback para quando se termina de carregar
    */
  carregar(cb?: () => void) {
    let count = 2;
    let trigger = () => {
      count--;
      if (cb && count == 0) {
        cb();
        this._carregou = true;
      }
    };
    this.storage.get('notas').then((val) => {
      this.notas = JSON.parse(val) || {};
      trigger();
    });
    this.storage.get('notas-enviar').then((val) => {
      let pEnviar = JSON.parse(val) || [];
      this.notasEnviar = new LinkedList<NotaEnvioInterface>(pEnviar);
      trigger();
    });
  }

  /**
    * Apaga do armazenamento local as notas já enviadas
    */
  apagar() {
    this.notas = {};
    this.storage.remove('notas');
  }

  /**
   * Executa uma dada ação após garantir que as notas foram carregadas
   * @param cb Callback executada após garantir que as notas foram carregadas
   */
  disponivel(cb: () => void) {
    if (this._carregou)
      cb();
    else
      this.carregar(cb);
  }

  /**
     * Registra uma ação a ser feita quando uma nota é enviada
     * @param cb Função chamada passando as informações da nota enviada como parâmetro
     */
  aoEnviar(cb: (nota: NotaInterface) => void) {
    this.envio.subscribe(cb);
  }

  /**
      * Envia para o servidor uma nota referente a uma atividade
      * @param eventoID ID do evento
      * @param ativID ID da atividade avaliada
      * @param usuarioID ID do usuário que está avaliando
      * @param tipoNota Tipo da nota enviada
      * @param nota Valor da nota enviada
      * @param horaInicio Hora de início da atividade avaliada
      * @param horaFim Hora de fim da atividade avaliada
      * @param sucessoCb Callback para quando se envia com sucesso
      * @param falhaCb Callback para quando falha o envio
      */
  enviar(eventoID: string, ativID: string, usuarioID: string, tipoNota: TipoNota, nota: number,
    horaInicio: Date, horaFim: Date, sucessoCb?: () => void, falhaCb?: () => void) {

    if (!this.notas[ativID])
      this.notas[ativID] = [-1, -1, -1];

    this.notas[ativID][tipoNota] = nota;

    this.servidor.atividades.enviarNota(tipoNota, eventoID, ativID, usuarioID, nota).subscribe(() => {
      this.envio.next({
        tipo: tipoNota,
        nota: nota,
        ativID: ativID,
        eventoID: eventoID,
        usuarioID: usuarioID
      });
      this.salvar();
      if (sucessoCb) sucessoCb();
    }, () => {
      this.notasEnviar.add({
        notas: this.notas[ativID].filter(() => true),
        ativID: ativID,
        eventoID: eventoID,
        usuarioID: usuarioID,
        horaInicio: horaInicio.toString(),
        horaFim: horaFim.toString()
      });
      this.salvar();
      if (falhaCb) falhaCb();
    });
  }

  /**
     * Informa a nota de um dado tipo, referente a uma dada atividade
     * @param ativID ID da atividade
     * @param tipoNota Tipo da nota
     * @returns A nota, ou, se não havia nenhuma nota associada, retorna null como código de erro
     */
  getNota(ativID: string, tipoNota: TipoNota): number {
    let nota: number[] = this.notas[ativID];
    if (!nota)
      return null;
    else
      return (nota[tipoNota] != -1) ? nota[tipoNota] : null;
  }


  /**
   * @param tipoNota Tipo da nota
   * @param inicioAtiv Hora de início da atividade
   * @param fimAtiv Hora de fim da atividade
   * @returns Se pode votar num dado intervalo de tempo, de acordo com o tipo de nota
   */
  static podeVotar(tipoNota: TipoNota, inicioAtiv: Date, fimAtiv?: Date): boolean {
    if (tipoNota == TipoNota.Ativ)
      return DatasUtil.estaNaHora(inicioAtiv);
    else
      return DatasUtil.estaNaHora(inicioAtiv, fimAtiv);
  }

  /**
   * Reenvia todas as notas ainda não enviadas e que estão dentro do seu horário limite
   */
  reenviar() {
    let apagar: number[] = [];
    let count: number = 0;
    let trigger = () => {
      count--;
      if (count == 0) {
        this.notasEnviar.remove(...apagar);
        this.salvar();
      }
    }
    let hi: Date, hf: Date;
    this.notasEnviar.forEach((nt, i) => {
      let vazios = 0;
      hi = new Date(nt.horaInicio);
      hf = new Date(nt.horaFim);
      for (let t = 0; t < nt.notas.length; t++) {
        count++;
        if (nt.notas[t] != -1) {
          if (NotasService.podeVotar(t, hi, hf)) {
            this.servidor.atividades.enviarNota(t, nt.eventoID, nt.ativID, nt.usuarioID, nt.notas[t]).subscribe(() => {
              this.envio.next({ tipo: t, nota: nt.notas[t], ativID: nt.ativID, eventoID: nt.eventoID, usuarioID: nt.usuarioID });
              nt.notas[t] = -1;
              if (nt.notas.every(n => n == -1))
                apagar.push(i);
              trigger();
            }, trigger);
          } else {
            nt.notas[t] = -1;
            setTimeout(trigger, 100);
          }
        } else {
          vazios++;
          if (vazios == 3)
            apagar.push(i);
          setTimeout(trigger, 100);
        }
      }
    });
  }





}
