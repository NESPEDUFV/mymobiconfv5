import { ServidorService } from './servidor/servidor.service';
import { ArmazenamentoService } from './armazenamento.service';
import { Injectable } from '@angular/core';



/** Dados de um parceiro/patrocinador */
export interface ParceiroInterface {
  /** ID do patrocinador */
  ID: string
  /** Nome do patrocinador */
  nome: string
  /** Prioridade (ranking) do patrocinador. A prioridade deve ser um número entre 0 a 3, sendo 0 - Diamante, 1 - Ouro, 2 - Prata, 3 - Bronze */
  prioridade: number
  /** URL do site do patrocinador */
  url: string
  /** URL da imagem do patrocinador */
  urlImg: string
}
@Injectable({
  providedIn: 'root'
})
export class ParceirosService {
  /** Armazena a lista de patrocinadores */
  private parceiros: ParceiroInterface[] = [];
  /** @ignore */
  private _carregou: boolean = false;
  /** @ignore */
  private _existeDados: boolean = false;

  constructor(private storage: ArmazenamentoService, private servidor: ServidorService) { }

  /**
   * Salva a lista de parceiros
   */
  salvar() {
      this.storage.set('parceiros', JSON.stringify(this.parceiros));
  }

    /**
     * Carrega a lista de parceiros do armazenamento local
     * @param cb Callback para quando consegue carregar do armazenamento local
     * @param falhaCb Callback para quando não há dados salvos
     */
     carregar(cb?: () => void) {
      this.storage.get('parceiros').then((val) => {
          let parceiros = JSON.parse(val);
          this.parceiros = parceiros || [];
          this._existeDados = (parceiros) ? true : false;
          this._carregou = true;
          if (cb) cb();
      });
  }

  /**
   * Apaga a lista de parceiros
   */
  apagar() {
      this.parceiros = [];
      this.storage.remove('parceiros');
  }

  /**
   * Executa uma dada ação após garantir que os parceiros foram carregados
   * @param cb Callback executada após garantir que os parceiros foram carregados
   */
  disponivel(cb: () => void) {
      if (this._carregou)
          cb();
      else
          this.carregar(cb);
  }

  /**
   * Busca a lista de parceiros, primeiro do local e depois do servidor se falhar
   * @param eventoID ID do evento cujos parceiros serão buscados
   * @param sucessoCb Callback para quando se obtem os dados da lista
   * @param falhaCb Callback para quando falha ao obter os dados de ambos
   */
  buscar(eventoID: string, sucessoCb?: () => void, falhaCb?: () => void) {
      this.carregar(() => {
          if (this._existeDados) {
              if (sucessoCb) sucessoCb();
          } else {
              this.servidor.parceiros.buscar(eventoID).subscribe((data: any) => {
                  this.parceiros = this.formatarLista((data && data.patrocinadores) ? data.patrocinadores : []);
                  this.salvar();
                  if (sucessoCb) sucessoCb();
              }, () => { if (falhaCb) falhaCb(); });
          }
      });
  }

  /**
   * Recebe a lista de parceiros vinda do servidor, formata para o app e ordena de acordo com a prioridade (sendo 0 a mais alta, e 3 a mais baixa, em ordem crescente)
   * @param parceiros Lista de parceiros no formato do servidor
   * @returns Lista de parceiros no formato do app
   */
  private formatarLista(parceiros: any[]): ParceiroInterface[] {
      let ps: ParceiroInterface[] = [];
      for (let p of parceiros)
          ps.push(this.formatarObj(p));
      ps.sort((a, b) => a.prioridade - b.prioridade);
      return ps;
  }

  /**
   * @param parceiro Parceiro no formato do servidor
   * @returns Parceiro no formato do app
   */
  private formatarObj(parceiro: any): ParceiroInterface {
      return {
          ID: parceiro.ID,
          nome: parceiro.Nome,
          prioridade: +parceiro.prioridade,
          url: parceiro.url,
          urlImg: parceiro.urlImagem
      };
  }

  /**
   * Retorna a lista ordenada dos parceiros de acordo com sua prioridade (sendo 0 a mais alta, e 3 a mais baixa, em ordem crescente)
   * @returns Lista de parceiros ordenados por prioridade
   */
  listarPorPrioridade(): ParceiroInterface[] {
      return this.parceiros;
  }
}
