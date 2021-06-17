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

  constructor(private servidor: ServidorService, private storage: ArmazenamentoService) { }
  getID(): string { return this.dados.ID; }
  getNome(): string { return this.dados.nome; }
  getFotoURL(): string { return this.fotoURL; }

   /**
     * Salva os dados do usuário no armazenamento local
     */
    salvar() {
      //this.storage.set('usuario', JSON.stringify(this.dados));
      //this.storage.set('fotoURL', JSON.stringify(this.fotoURL));
  }

   /**
     * Carrega os dados do usuário do armazenamento local
     * @param cb Callback para quando os dados do usuário tiverem sido carregados
     */
    carregar(cb?: () => void) {
      /*
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
      */
  }

   /**
     * Efetua o logout do app, apagando os dados do usuário
     */
    logout() {
      this.dados = null;
      this.fotoURL = "";
      this.salvar();
  }
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
    console.log("Aqui em usuario\n");
  // this.servidor.login.email(email);

    this.servidor.login.email(email).subscribe((data: any) => {
      if (data.usuario == 0)
          usuarioFalhaCb();
      else {
          this.dados = data.usuario[0];
          this.fotoURL = "";
          this.salvar();
          loginCb();
      }
  }, () => {
      falhaCb();
  });

  }

  /**
       * Efetua login via Facebook
       * @param loginCb Callback executada quando há sucesso no login
       * @param falhaCb Callback executada quando há algum erro na conexão ou no processo de login
       */


 loginFB(loginCb: () => void, falhaCb: () => void) {
  this.servidor.login.facebookLogin((resposta) => {
      if (resposta && resposta.user) {
          this.servidor.login.facebookEnviarInfo(resposta.user.displayName, resposta.user.email).subscribe((data: any) => {
              if (data.success == 1 || data.success == 2) {
                  this.dados = data.usuario[0];
                  this.fotoURL = resposta.user.photoURL;
                  this.salvar();
                  loginCb();
              } else
                  falhaCb();
          }, falhaCb);
      } else
          falhaCb();
  }, falhaCb);
}


/**
     * Cria uma nova conta
     * @param nome Nome do novo usuário
     * @param email E-mail do novo usuário
     * @param sucessoCb Callback para quando cria uma nova conta
     * @param emailRepetidoCb Callback para quando o e-mail já está sendo usado por outra conta
     * @param falhaCb Callback para quando há falha durante a criação da conta
     */


 signup(nome: string, email: string, sucessoCb?: () => void, emailRepetidoCb?: () => void, falhaCb?: () => void) {
  console.log("Usuario service\n");

  this.servidor.login.signup(nome, email).subscribe((data: any) => {
      if (data.success == 1 && sucessoCb)
          sucessoCb();
      else if (data.success == 2 && emailRepetidoCb)
          emailRepetidoCb();
      else if (falhaCb)
          falhaCb();
  }, falhaCb);
}
}


