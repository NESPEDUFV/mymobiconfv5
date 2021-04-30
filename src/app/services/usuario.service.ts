import { Injectable } from '@angular/core';
import { ArmazenamentoService } from './armazenamento.service';
import { ServidorService } from './servidor/servidor.service';


/** Dados de usuário */
export interface UsuarioInterface {
  /** ID do usuário */
  ID: string
  /** Nome do usuário */
  nome: string
  /** E-mail do usuário */
  email: string
}


@Injectable({
  providedIn: 'root'
})


export class UsuarioService {
   /** Dados gerais do usuário */
   private dados: UsuarioInterface = null;
   /** URL da foto do usuário, para quando há login via Facebook */
   private fotoURL: string = "";

  constructor(private servidor: ServidorService) { }
  getID(): string { return this.dados.ID; }
  getNome(): string { return this.dados.nome; }
  getFotoURL(): string { return this.fotoURL; }

    /**
     * @returns Se há dados do usuário
     */
   existeDados(): boolean {
    return this.dados != null;
}

    /**
     * @returns Se há um URL de foto
     */
    existeFotoURL(): boolean {
        return this.fotoURL != "" && this.fotoURL != null;
    }

    /**
     * Executa uma dada ação após garantir que os dados gerais do usuário foram carregados
     * @param cb Callback executada após garantir que os dados gerais do usuário foram carregados
     */
    disponivel(cb: () => void) {
        if (this.existeDados())
            cb();
        else
            //this.carregar(cb);
            console.log("Carregar em construção\n");
    }

/**
 * Efetua o login via e-mail
 * @param email E-mail usado no login
 * @param loginCb Callback executada quando há sucesso no login
 * @param usuarioFalhaCb Callback executada quando não existe o email no banco de dados
 * @param falhaCb Callback executada quando há algum erro na conexão ou falha de resposta
 */
loginEmail(email: string, loginCb: () => void, usuarioFalhaCb: () => void, falhaCb: () => void) {

}

/*
  loginEmail(email: string){
    console.log(email);
  }
*/

}
