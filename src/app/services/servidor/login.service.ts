  //import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


/**
 * Conexões com o servidor relacionadas a login
 */
 export class ServLogin {
  /**
   * @param http Usado para fazer os requests HTTP
   * @param url URL do servidor
   * @param key Chave para realizar alteração no banco
   */
  constructor(private http: HttpClient, private url: string, private key: string) { }

   /**
     * Cria uma nova conta
     * @param nome Nome do usuário
     * @param email E-mail do usuário
     */
    signup(nome: string, email: string) {
      console.log("chegou login servidor\n");

      return this.http.post(this.url + "/App/SignUpApp.php", {
          username: nome,
          email: email,
          key: this.key
      });

  }


  /**
     * Realiza o login via email
     * @param email E-mail do usuário
     */
   email(email: string) {
    return this.http.post(this.url + "/App/loginApp.php", { email: email });
}

}
