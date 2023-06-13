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
import { ServOpnioes } from './serv-opnioes.service';
import { ServConfiguracoesGame } from '../game/servidor/configuracao.service';
import { ServParticipanteGame } from '../game/servidor/participante.service';
import { ServGrupoGame } from '../game/servidor/grupo.service';
import { ServRankingGame } from '../game/servidor/ranking.service';
import { ServAlbum } from './album.service';

@Injectable({
  providedIn: 'root'
})
export class ServidorService {
  /** URL do servidor */
  //private url: string = "http://200.131.220.164/scapeteste/versaoteste_php/mymobiconfapp-php/";
  //private url: string = "http://200.131.220.164/scapeteste/master_php/mymobiconfapp-php/";

  //private url: string = "http://200.131.220.164/scapeteste/versaoteste_php/mymobiconfapp-php/";
  //private url: string = "http://200.131.220.164/scapeteste/secom2020PHP/mymobiconfapp-php/";
  //"http://200.131.220.164/scapeteste/master_php/mymobiconfapp-php/"
  //"http://200.131.220.164/scapeteste/versaoteste_php/mymobiconfapp-php/"
  //"http://200.131.220.164/scapeteste/mymobiconfphp/"
  //"http://200.131.220.164/scapeteste/mymobiconfweb"
  //"http://192.168.0.4";
  private url  = "http://192.168.1.2:8002"
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
   /** Reúne as funções referentes às opiniões */
   readonly opinioes: ServOpnioes;
   /** Reúne as funções referentes às perguntas */
   readonly perguntas: ServPerguntas;
  /** Reúne as funções referentes aos votos */
    readonly votos: ServVotos;

  readonly noticias: ServNoticias;
  /** Reúne as funções referentes aos parceiros/patrocinadores */
  readonly parceiros: ServParceiros;

  readonly questionarios: ServQuestionarios;

  readonly album: ServAlbum;


  //gamefication samuel
  readonly game_participante: ServParticipanteGame;
  readonly game_configuracao: ServConfiguracoesGame;
  readonly game_grupo: ServGrupoGame;
  readonly game_ranking: ServRankingGame;


  constructor(http: HttpClient) {

    this.login = new ServLogin(http, this.url, this.key);
    this.eventos = new ServEventos(http, this.url);
    this.parceiros = new ServParceiros(http, this.url);
    this.salas = new ServSalas(http, this.url);
    this.opinioes = new ServOpnioes(http, this.url);
    this.atividades  = new ServAtividades(http, this.url);
    this.questionarios = new ServQuestionarios(http, this.url);
    this.noticias  = new ServNoticias(http, this.url);
    this.perguntas = new ServPerguntas(http, this.url);
    this.votos = new ServVotos(http, this.url);


		//gamefication samuel
    this.game_participante = new ServParticipanteGame(http, this.url, this.key);
    this.game_grupo = new ServGrupoGame(http, this.url, this.key);
    this.game_grupo = new ServGrupoGame(http, this.url, this.key);
    this.game_ranking = new ServRankingGame(http, this.url, this.key);
    // this.game_atividade = new ServAtividadeGame(http, this.url, this.key);
    this.game_configuracao = new ServConfiguracoesGame(http, this.url, this.key);

    //album de figurinhas
    this.album = new ServAlbum(http,this.url);

  }
}

