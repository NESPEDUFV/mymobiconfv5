import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { ServLogin } from './login.service';
import { ServEventos } from './eventos.service';
@Injectable({
  providedIn: 'root'
})
export class ServidorService {
  /** URL do servidor */

  private url: string = "http://200.131.220.164/scapeteste/master_php/mymobiconfapp-php/";

  //private url: string = "http://200.131.220.164/scapeteste/versaoteste_php/mymobiconfapp-php/";
  //private url: string = "http://200.131.220.164/scapeteste/secom2020PHP/mymobiconfapp-php/";
  //"http://200.131.220.164/scapeteste/master_php/mymobiconfapp-php/"
  //"http://200.131.220.164/scapeteste/versaoteste_php/mymobiconfapp-php/"
  //"http://200.131.220.164/scapeteste/mymobiconfphp/"
  //"http://200.131.220.164/scapeteste/mymobiconfweb"
  //"http://192.168.0.4";
  //"http://127.0.0.1";//
  /** @ignore */
  private key: string = "scape20132015appKey#releaseVersionApril2016";

  /** Reúne as funções referentes aos métodos de login e criação de conta */
  readonly login: ServLogin;

    /** Reúne as funções referentes aos eventos */
    readonly eventos: ServEventos;


  constructor(http: HttpClient) {

    this.login = new ServLogin(http, this.url, this.key);
    this.eventos = new ServEventos(http, this.url);
  }
}

