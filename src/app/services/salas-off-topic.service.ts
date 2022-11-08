import { ServidorService } from './servidor/servidor.service';
import { ArmazenamentoService } from './armazenamento.service';
import { Injectable } from '@angular/core';

/** Dados de uma sala off-topic */
export interface SalasOffTopicInterface {
  /** ID da sala */
  id_sala: string
  /** nome da sala */
  nome: string
  /** descricao */
  descricao: string
  /** link */
  link: string
}


@Injectable({
  providedIn: 'root'
})
export class SalasOffTopicService {
  /** Armazena as salas off-topic já baixadas */
  private salas: SalasOffTopicInterface[] = [];
  /** @ignore */
  private _carregou: boolean = false;
  /** @ignore */
  private _existeDados: boolean = false;

  constructor(private storage: ArmazenamentoService, private servidor: ServidorService) { }


  /**
     * Salva os dados da lista de salas off-topic
     */
    salvar() {
        this.storage.set('salas', JSON.stringify(this.salas));
    }

    /**
     * Carrega a lista de salas off-topic do armazenamento local
     * @param cb Callback para quando se termina de carregar
     */
    carregar(cb?: () => void) {
        this.storage.get('salas').then((val) => {
            let salas = JSON.parse(val);
            this.salas = salas || [];
            this._existeDados = (salas) ? true : false;
            this._carregou = true;
            if (cb) cb();
        });
    }

    /**
     * Apaga a lista de salas off-topic
     */
    apagar() {
        this.salas = [];
        this.storage.remove('salas');
    }

    /**
     * Executa uma dada ação após garantir que as salas off-topic foram carregadas
     * @param cb Callback executada após garantir que as salas off-topic foram carregadas
     */
    disponivel(cb: () => void) {
        if (this._carregou)
            cb();
        else
            this.carregar(cb);
    }

    /**
     * Busca a lista de salas off-topic
     * @param eventoID ID do evento cujas salas off-topic serão buscadas
     * @param sucessoCb Callback para quando adquire os dados do servidor
     * @param falhaCb Callback para quando não há dados
     */

    buscar(eventoID: string, sucessoCb?: () => void, falhaCb?: () => void) {
        this.servidor.salas.buscar(eventoID).subscribe((data: any) => {
            this.salas = this.formatarLista((data && data.salas) ? data.salas : []);
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

    /**
     * @param salas Lista de sala off-topic no formato do servidor
     * @returns Lista de sala off-topic no formato do app
     */
    private formatarLista(salas: any[]): SalasOffTopicInterface[] {
        let ns: SalasOffTopicInterface[] = [];
        for (let p of salas)
            ns.push(this.formatarObj(p));
        return ns;
    }

    /**
     * @param sala sala off-topic no formato do servidor
     * @returns sala off-topic no formato do app
     */
    private formatarObj(sala: any): SalasOffTopicInterface {
        return {
            id_sala: sala.id_sala,
            nome: sala.nome,
            descricao: sala.descricao,
            link: sala.link
        };
    }

    getLista(): SalasOffTopicInterface[] {
        return this.salas;
    }
}
