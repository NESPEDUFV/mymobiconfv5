import { ServidorService } from './servidor/servidor.service';
import { ArmazenamentoService } from './armazenamento.service';
import { Injectable } from '@angular/core';


/** Dados de uma pergunta */
export interface RankingPerguntasInterface {
  /** id_pergunta */
  id_pergunta: string
  /** id_participante */
  id_participante: string
  /** pergunta */
  pergunta: string
  /** qtd de votos */
  qtd_votos: string
  /** votou */
  votou: number
  /** nome de quem enviou */
  nome: string
  /** vendo se é uma das favoritas */
  //favorito: number
}

@Injectable({
  providedIn: 'root'
})
export class PerguntasService {

  /** Armazena as perguntas já baixadas */
  private perguntas: RankingPerguntasInterface[] = [];
  /** @ignore */
  private _carregou: boolean = false;
  /** @ignore */
  private _existeDados: boolean = false;

  constructor(private storage: ArmazenamentoService, private servidor: ServidorService) { }

  /**
     * Salva os dados da lista de perguntas
     */
   salvar() {
    this.storage.set('perguntas', JSON.stringify(this.perguntas));
  }

   /**
     * Carrega a lista de perguntas do armazenamento local
     * @param cb Callback para quando se termina de carregar
     */
    carregar(cb?: () => void) {
      this.storage.get('perguntas').then((val) => {
          let perguntas = JSON.parse(val);
          this.perguntas = perguntas || [];
          this._existeDados = (perguntas) ? true : false;
          this._carregou = true;
          if (cb) cb();
      });
  }

   /**
     * Apaga a lista de perguntas
     */
    apagar() {
      this.perguntas = [];
      this.storage.remove('perguntas');
  }

  /**
   * Executa uma dada ação após garantir que as perguntas foram carregadas
   * @param cb Callback executada após garantir que as perguntas foram carregadas
   */
  disponivel(cb: () => void) {
      if (this._carregou)
          cb();
      else
          this.carregar(cb);
  }

  /**
     * Busca a lista de perguntas
     * @param eventoID ID do evento cujas perguntas serão buscadas
     * @param sucessoCb Callback para quando adquire os dados do servidor
     * @param falhaCb Callback para quando não há dados
     */

   buscar(eventoID: string, usuarioID:string, ativID?: string, sucessoCb?: () => void, falhaCb?: () => void) {
    if(ativID!="0"){
        this.servidor.perguntas.buscar(eventoID,usuarioID,ativID).subscribe((data: any) => {
            this.perguntas = this.formatarLista((data && data.perguntas) ? data.perguntas : []);
            this.salvar();
            if (sucessoCb) sucessoCb();
        }, () => {
            this.carregar(() => {
                if (this._existeDados) {
                    if (sucessoCb) sucessoCb();
                } else if (falhaCb) falhaCb();
            });
        });
    }else{
        this.servidor.perguntas.buscar(eventoID,usuarioID).subscribe((data: any) => {
            this.perguntas = this.formatarLista((data && data.perguntas) ? data.perguntas : []);
            this.salvar();
            if (sucessoCb) sucessoCb();
        }, () => {
            this.carregar(() => {
                if (this._existeDados) {
                    if (sucessoCb) sucessoCb();
                } else if (falhaCb) falhaCb();
            });
        });
    }

}

/**
 * @param perguntas Lista de perguntas no formato do servidor
 * @returns Lista de perguntas no formato do app
 */
private formatarLista(perguntas: any[]): RankingPerguntasInterface[] {
    let ns: RankingPerguntasInterface[] = [];
    for (let p of perguntas)
        ns.push(this.formatarObj(p));
    return ns;
}

/**
 * @param pergunta pergunta no formato do servidor
 * @returns pergunta no formato do app
 */
private formatarObj(pergunta: any): RankingPerguntasInterface {
    return {
        id_pergunta: pergunta.id_pergunta,
        id_participante: pergunta.id_participante,
        pergunta: pergunta.pergunta,
        qtd_votos: pergunta.qtd_votos,
        nome: pergunta.nome,
        //favorito: parseInt(pergunta.qtd_votos),
        votou: pergunta.votou

    };
}

getLista(): RankingPerguntasInterface[] {
    return this.perguntas;
}

}
