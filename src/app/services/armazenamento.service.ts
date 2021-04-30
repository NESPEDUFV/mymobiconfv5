import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/**
 * Gerencia os pedidos de carregar e de salvar do armazenamento local,
 * encapsulando a tecnologia de armazenamento local
 */
@Injectable()
export class ArmazenamentoService {
    /**
     * @param storage Módulo de armazenamento do Ionic
     */
    constructor(private storage: Storage) { }

    /**
     * Salva um par de chave-valor
     * @param chave Chave do valor a ser salvo
     * @param valor Valor a ser salvo
     */
    set(chave: string, valor: any) {
        return this.storage.set(chave, valor);
    }

    /**
     * Carrega o valor associado a uma chave
     * @param chave Chave a ser buscada
     * @returns Valor associado à chave
     */
    get(chave: string) {
        return this.storage.get(chave);
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
