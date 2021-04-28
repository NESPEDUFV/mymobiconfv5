import { Injectable } from '@angular/core';
import { ArmazenamentoProvider } from './armazenamento.service';
/*Pause

import { ServidorProvider } from './servidor/servidor';
*/


/** Dados de usuário */
export interface UsuarioInterface {
    /** ID do usuário */
    ID: string
    /** Nome do usuário */
    nome: string
    /** E-mail do usuário */
    email: string
}

/**
 * Armazena os dados referentes ao usuário e realiza login/logout
 */
@Injectable()
export class UsuarioProvider {
    /** Dados gerais do usuário */
    private dados: UsuarioInterface = null;
    /** URL da foto do usuário, para quando há login via Facebook */
    private fotoURL: string = "";

    //constructor(private servidor: ServidorProvider, private storage: ArmazenamentoProvider) { }

    getID(): string { return this.dados.ID; }
    getNome(): string { return this.dados.nome; }
    getFotoURL(): string { return this.fotoURL; }

     /**
     * Salva os dados do usuário no armazenamento local
     */
    /*
      salvar() {
        this.storage.set('usuario', JSON.stringify(this.dados));
        this.storage.set('fotoURL', JSON.stringify(this.fotoURL));
    }
 /**
     * Carrega os dados do usuário do armazenamento local
     * @param cb Callback para quando os dados do usuário tiverem sido carregados
     */
    /*
  carregar(cb?: () => void) {
    let count = 2;
    let trigger = () => {
        count--;
        if (cb && count == 0) cb();
    }
    this.storage.get('usuario').then((val) => {
        this.dados = JSON.parse(val);
        trigger();
    });
    this.storage.get('fotoURL').then((val) => {
        this.fotoURL = JSON.parse(val);
        trigger();
    });
}

/**
 * Efetua o logout do app, apagando os dados do usuário
 */
/*
logout() {
    this.dados = null;
    this.fotoURL = "";
    this.salvar();
}

/**
 * @returns Se há dados do usuário
 */

/*
existeDados(): boolean {
    return this.dados != null;
}

/**
 * @returns Se há um URL de foto
 */
/*
existeFotoURL(): boolean {
    return this.fotoURL != "" && this.fotoURL != null;
}

/**
 * Executa uma dada ação após garantir que os dados gerais do usuário foram carregados
 * @param cb Callback executada após garantir que os dados gerais do usuário foram carregados
 */
/*
disponivel(cb: () => void) {
    if (this.existeDados())
        cb();
    else
        this.carregar(cb);
}

/**
 * Efetua o login via e-mail
 * @param email E-mail usado no login
 * @param loginCb Callback executada quando há sucesso no login
 * @param usuarioFalhaCb Callback executada quando não existe o email no banco de dados
 * @param falhaCb Callback executada quando há algum erro na conexão ou falha de resposta
 */

loginEmail(email: string, loginCb: () => void, usuarioFalhaCb: () => void, falhaCb: () => void) {
  console.log("login email");
}

}
