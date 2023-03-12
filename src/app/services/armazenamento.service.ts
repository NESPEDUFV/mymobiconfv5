import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { from, Observable } from 'rxjs';

/**
 * Gerencia os pedidos de carregar e de salvar do armazenamento local,
 * encapsulando a tecnologia de armazenamento local
 */
@Injectable()
export class ArmazenamentoService {
    /**
     * @param storage Módulo de armazenamento do Ionic, algumas mudanças foram feitas devida a nova versão do Storage, referencia: https://ionicframework.com/blog/announcing-ionic-storage-v3/
     */

    private _storage: Storage | null = null;
    constructor(private storage: Storage) {
      this.init();
    }

    async init() {
      // If using, define drivers here: await this.storage.defineDriver(/*...*/);
      const storage = await this.storage.create();
      this._storage = storage;
    }
    /**
     * Salva um par de chave-valor
     * @param chave Chave do valor a ser salvo
     * @param valor Valor a ser salvo
     */
    public set(chave: string, valor: any) {
         this._storage.set(chave, valor);
    }

    /**
     * Carrega o valor associado a uma chave
     * @param chave Chave a ser buscada
     * @returns Valor associado à chave
     */
    get(chave: string) {
        return this.storage.get(chave);
    }

    public setObservable(chave: string, valor: any): Observable<void> {
      return from(new Promise<void>((resolve) => {
          this._storage.set(chave, valor);
          resolve();
      }));
  }

    /**
     * Deleta o valor associado a uma chave
     * @param chave Chave cujo valor será apagado
     */
    remove(chave: string) {
        return this.storage.remove(chave);
    }

    /**
     * Limpa todo o armazenamento
     */
    clear() {
        return this.storage.clear();
    }
}
