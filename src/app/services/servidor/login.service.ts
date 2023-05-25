  //import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import  firebase from 'firebase/app'; // Firebase Auth - usado para login com facebook
import 'firebase/auth';


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
    console.log('url: ',this.url + "/App/loginApp.php")
    return this.http.post(this.url + "/App/loginApp.php", { email: email });
}


 /**
     * Login via facebook
     * @param sucesso Callback de sucesso, passa a resposta como parâmetro
     * @param falha Callbackde falha, é chamada caso a conexão ou o login falhe
     */


  facebookLogin(sucesso: (resposta: firebase.auth.UserCredential) => void, falha: () => void) {
    console.log("Chegou servLogin\n");
    console.log(firebase);
    let provider = new firebase.auth.FacebookAuthProvider();
    firebase.auth().signInWithRedirect(provider).then(() => {
        firebase.auth().getRedirectResult().then((result) => {
            sucesso(result);
        }, () => {
            falha();
        });
    }, () => {
        falha();
    });

  }
/**
 * Manda informação do login por Facebook para o banco de dados
 * @param nome Nome do usuário
 * @param email E-mail do usuário
 */
facebookEnviarInfo(nome: string, email: string) {
    return this.http.post(this.url + "/App/loginFacebookApp.php", {
        nome: nome,
        email: email,
        key: this.key
    });
}

}
