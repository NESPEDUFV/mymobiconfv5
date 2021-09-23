import { ServVotos } from './votos.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { ServLogin } from './login.service';
import { ServEventos } from './eventos.service';
import { ServParceiros } from './parceiros.service';
import { ServPerguntas } from './perguntas.service';
import { ServSalas } from './salas-off-topic.service';
import { ServNoticias } from './noticias.service';
import { ServAtividades } from './atividades.service';
import { ServQuestionarios } from './questionario.service';

@Injectable({
  providedIn: 'root'
})
export class ServidorService {
  /** URL do servidor */
  private url: string = "http://200.131.220.164/scapeteste/versaoteste_php/mymobiconfapp-php/";
  //private url: string = "http://200.131.220.164/scapeteste/master_php/mymobiconfapp-php/";

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

  /** Reúne as funções referentes às atividades */
  readonly atividades: ServAtividades;
  /** Reúne as funções referentes aos métodos de login e criação de conta */
  readonly login: ServLogin;
  /** Reúne as funções referentes aos eventos */
  readonly eventos: ServEventos;
  /** Reúne as funções referentes às salas off-topic */
  readonly salas: ServSalas;
   /** Reúne as funções referentes às perguntas */
   readonly perguntas: ServPerguntas;
  /** Reúne as funções referentes aos votos */
    readonly votos: ServVotos;

  readonly noticias: ServNoticias;
  /** Reúne as funções referentes aos parceiros/patrocinadores */
  readonly parceiros: ServParceiros;

  readonly questionarios: ServQuestionarios;




  constructor(http: HttpClient) {

    this.login = new ServLogin(http, this.url, this.key);
    this.eventos = new ServEventos(http, this.url);
    this.parceiros = new ServParceiros(http, this.url);
    this.salas = new ServSalas(http, this.url);
    this.atividades  = new ServAtividades(http, this.url);
    this.questionarios = new ServQuestionarios(http, this.url);
    this.noticias  = new ServNoticias(http, this.url);
    this.perguntas = new ServPerguntas(http, this.url);
    this.votos = new ServVotos(http, this.url);

  }
}

