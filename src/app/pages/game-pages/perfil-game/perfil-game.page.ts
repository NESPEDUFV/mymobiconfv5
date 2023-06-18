import { EventoService } from 'src/app/services/evento.service';
import { GameParticipanteService } from './../../../services/game/participante.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ConfigService } from 'src/app/services/config.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { FormBuilder } from '@angular/forms';
import { ConfiguracoesService } from 'src/app/services/game/configuracoes.service';
import { PassosMsgs, PassosTutorial } from 'src/app/components/tutorial/passos';

@Component({
  selector: 'app-perfil-game',
  templateUrl: './perfil-game.page.html',
  styleUrls: ['./perfil-game.page.scss'],
})
export class PerfilGamePage implements OnInit {

  /** @ignore */
  @ViewChild('tutRanking', { read: ElementRef }) tutRanking: ElementRef;
  /** @ignore */
  @ViewChild('tutBarra', { read: ElementRef }) tutBarra: ElementRef;
  /** @ignore */
  @ViewChild('tutEditar', { read: ElementRef }) tutEditar: ElementRef;
  /** @ignore */
  @ViewChild('tutInfo', { read: ElementRef }) tutInfo: ElementRef;
  /** @ignore */
  @ViewChild('tutConquista1', { read: ElementRef }) tutConquista1: ElementRef;
  /** @ignore */
  @ViewChild('tutConquista2', { read: ElementRef }) tutConquista2: ElementRef;
  /** @ignore */
  @ViewChild('tutConquista3', { read: ElementRef }) tutConquista3: ElementRef;
  /** Controla quando o tutorial é ativado */
  ativarTut: boolean = false;
  /** Passos do tutorial desta página */
  passos: { el: ElementRef, msg: string }[] = [];

  public carregado = false;
  public naoFecharAoSair = false; //não excluir a pagina quando for a primeira aberta

  public idUsuarioLogado = 1;
  public nome = "NÃO CARREGADO";
  public imagem = 1;
  public posicao = 2;
  public pontos = 100;
  public pontosNivel = 50;
  public razaoPontos = this.pontos / this.pontosNivel * 100;
  public nivel = 1;
  public descNivel = "NÃO CARREGADO";
  public ptsAvaliacao = 15;

  public idUsuarioMostrar;

  public perfilUsuario = true;

  public grupo = "NÃO CARREGADO";
  public idGrupo = -1;
  public temGrupo = false;
  public email = "NÃO CARREGADO";
  public celular = "NÃO CARREGADO";
  public sobre = "NÃO CARREGADO";


  public conquistaOpiniao = false;
  public qtdOpiniao = " ";
  public conquistaQuestionario = true;
  public qtdQuestionario = "x2";
  public conquistaTemperatura = true;
  public qtdTemperatura = "x3";
  public conquistaSonoro = true;
  public qtdSonoro = "x1";
  public conquistaAvaliacao = true;
  public qtdAvaliacao = "x2";
  public conquistaCompleto = false;
  public qtdCompleto = " ";

  public medalha = false;

  public trofeu = [false, false, false];


  public insignia = [true, false, false, false, false, false, false, false, false, false];

  /**Para verificar se é online ou presencial */
  isOnline: number;

  public conquistas = [{ nome: 'Conquista de Opinião', desc: 'Ganha a cada opinião dada' },
  { nome: 'Conquista Resposta de Questionário', desc: 'Ganha a cada questionário respondido"' },
  { nome: 'Conquista Avaliação Sonora', desc: 'Ganha a cada avaliação sonora de uma atividade' },
  { nome: 'Conquista Avaliação de Atividade', desc: 'Ganha a cada avaliação de uma atividade' },
  { nome: 'Conquista Avaliação de Temperatura', desc: 'Ganha a cada avaliação de temperatura de uma atividade"' },
  { nome: 'Conquista Atividade Completa', desc: 'Ganha a cada vez que uma atividade foi avaliada em todos os quesitos' }
  ];

  public descMedalha = {
    nome: 'Medalha de Diamante',
    desc: 'Para ganhar, basta você responder todos os questionários'
  };

  public trofeus = [{ nome: 'Troféu 1° Lugar', desc: 'É ganho pelo 1° colocado no Ranking de Pontos, ao final do evento.' },
  { nome: 'Troféu 2° Lugar', desc: 'É ganho pelo 2° colocado no Ranking de Pontos, ao final do evento.' },
  { nome: 'Troféu 3° Lugar', desc: 'É ganho pelo 3° colocado no Ranking de Pontos, ao final do evento.' }];

  public insigniasDesc = [{ nome: 'Nível 1', desc: 'Para subir para esse nível, obtenha uma pontuação de X pontos' }, //nível 1
  { nome: 'Nível 2', desc: 'Para subir para esse nível, obtenha uma pontuação de X pontos' },//nível 2
  { nome: 'Nível 3', desc: 'Para subir para esse nível, obtenha uma pontuação de X pontos' },//nível 3
  { nome: 'Nível 4', desc: 'Para subir para esse nível, obtenha uma pontuação de X pontos' },//nível 4
  { nome: 'Nível 5', desc: 'Para subir para esse nível, obtenha uma pontuação de X pontos' },//nível 5
  { nome: 'Nível 6', desc: 'Para subir para esse nível, obtenha uma pontuação de X pontos' },//nível 6
  { nome: 'Nível 7', desc: 'Para subir para esse nível, obtenha uma pontuação de X pontos' },//nível 7
  { nome: 'Nível 8', desc: 'Para subir para esse nível, obtenha uma pontuação de X pontos' },//nível 8
  { nome: 'Nível 9', desc: 'Para subir para esse nível, obtenha uma pontuação de X pontos' },//nível 9
  { nome: 'Nível 10', desc: 'Para subir para esse nível, obtenha uma pontuação de X pontos' }];//nível 10
  constructor(
    public router: Router, public route: ActivatedRoute, private alertCtrl: AlertController,
    public formBuilder: FormBuilder, private config: ConfigService, public loadingCtrl: LoadingController,
    platform: Platform, private usuario: UsuarioService,
    private gameParticipante: GameParticipanteService,
    private gameConfig: ConfiguracoesService,
    private evento: EventoService
  ) {
    console.log('SNAPSHOT:', this.route.snapshot.paramMap.get('primeira'))
    const idUser =  this.usuario.getID();
    const idEvento = this.evento.getID();


      if(this.gameParticipante.existeDados()){
          this.gameParticipante.atualizarDados(()=>{
              this.mostrarDados(idUser);
          },()=>{
              this.mostrarDados(idUser);
          });
      }


  }



  ngOnInit() {
  }


  mostrarDados(idMostrar, okCb?: () => void) {
    this.gameParticipante.carregar(() => { //carrega dados
      //console.log("Dados carregados\n ID:" + idMostrar);

      if (idMostrar == undefined || idMostrar == this.gameParticipante.getID()) {
        console.log('dentro if')
        this.carregaPerfilLogado(() => {
          if (okCb) okCb();
        });

        /*                this.gameParticipante.atualizarDados(()=>{
                            this.carregaPerfilLogado();
                            //--console.log("carregado!");

                        },()=>{
                            alert("Nao carregado");
                            this.carregaPerfilLogado();
                        });*/

        this.idUsuarioMostrar = this.gameParticipante.getID();
        this.idUsuarioMostrar = this.gameParticipante.getID();
        this.perfilUsuario = true;
        //this.carregaPerfilLogado();
      } else {
        this.idUsuarioMostrar = idMostrar;
        console.log('id eventos são diferentes?', this.gameParticipante.getIDEvento());
        console.log('id eventos são diferentes?',this.evento.getID());
        this.gameParticipante.visualizarParticipante(idMostrar, this.gameParticipante.getIDEvento(), (val: any) => {
          this.mostrarPerfilPesquisado(val, () => {
            if (okCb) okCb();
          });
        }, () => { });
        this.perfilUsuario = false;
      }


    });

  }

  ionViewWillEnter() {
    //--console.log("ionViewWillEnter");
    this.isOnline  = this.evento.getIsOnline();
    this.gameConfig.carregarConfiguracoes(() => {}, () => {});

    if (this.idUsuarioMostrar != undefined) {
        //--console.log("carrega dados");
        this.mostrarDados(this.idUsuarioMostrar);
    }

    this.tutorial();

    /*this.gameParticipante.carregar(() => { //carrega dados
        //--console.log("Dados carregados");

        //--console.log(this.idUsuarioMostrar +" || "+this.idUsuarioMostrar +"=="+ this.gameParticipante.getID())

        if (this.idUsuarioMostrar == undefined || this.idUsuarioMostrar == this.gameParticipante.getID()) {
            this.carregaPerfilLogado();
            this.idUsuarioMostrar = this.gameParticipante.getID();
            this.idUsuarioMostrar = this.gameParticipante.getID();


            //this.carregaPerfilLogado();
        }


    });*/

    /*this.carregarPerfilGame(()=>{
        this.carregarDados();

    },()=>{
        this.mostraAlerta("Erro ao carregar perfil","Não foi possível carregar o perfil.");
        });*/

}

tutorial(){
    if (!this.config.tutorialFoiVisto(PassosTutorial.Perfil)) {
        this.passos = [
            { el: this.tutRanking, msg: PassosMsgs[PassosTutorial.Perfil][0] },
            { el: this.tutBarra, msg: PassosMsgs[PassosTutorial.Perfil][1] },
            { el: this.tutEditar, msg: PassosMsgs[PassosTutorial.Perfil][2] },
            { el: this.tutInfo, msg: PassosMsgs[PassosTutorial.Perfil][3] },
            { el: this.tutConquista1, msg: PassosMsgs[PassosTutorial.Perfil][4] },
            { el: this.tutConquista2, msg: PassosMsgs[PassosTutorial.Perfil][5] },
            { el: this.tutConquista3, msg: PassosMsgs[PassosTutorial.Perfil][6] }
        ];
    }
}

viuTutorial(passo: number) {
    if (passo == -1 || passo == this.passos.length) {
        this.ativarTut = false;
        this.config.tutorialMarcarVisto(PassosTutorial.Perfil);
    }
}

doRefresh(event) {

  if (this.perfilUsuario) {
      this.gameParticipante.atualizarDados(() => {

          this.carregaPerfilLogado(() => {
              event.complete();
          });

      }, () => {
          this.mostraAlerta("Erro ao carregar dados", "Não foi possível atualizar os dados");
          event.complete();
      });
  } else {
      this.mostrarDados(this.idUsuarioMostrar, () => {
          event.complete();
      });

  }

}



  private carregaPerfilLogado(okCb?: () => void) {
    let ativarTut = () => {
      setTimeout(() => {
        if (!this.config.tutorialFoiVisto(PassosTutorial.Perfil)) {
          this.passos[0].el = this.tutRanking;
          this.passos[1].el = this.tutBarra;
          this.passos[2].el = this.tutEditar;
          this.passos[3].el = this.tutInfo;
          this.passos[4].el = this.tutConquista1;
          this.passos[5].el = this.tutConquista2;
          this.passos[6].el = this.tutConquista3;
          this.ativarTut = true;
        }
      }, 200);
    };

    this.idUsuarioLogado = this.gameParticipante.getID();
    this.montaInfos(this.gameParticipante.getQuestionario(),
      this.gameParticipante.getSonoro(),
      this.gameParticipante.getAvaliacao(),
      this.gameParticipante.getTemperatura(),
      this.gameParticipante.getCompleto(),
      this.gameParticipante.getOpiniao(),
      this.gameParticipante.getDiamante());

    //--console.log("Mostra o perfil logado");
    this.perfilUsuario = true;
    this.imagem = this.gameParticipante.getImagem();
    this.nome = this.gameParticipante.getNome();
    this.celular = this.gameParticipante.getCelular();
    this.sobre = this.gameParticipante.getDescricao();
    this.nivel = this.gameParticipante.getNivel();
    this.pontos = this.gameParticipante.getPontos();
    this.pontosNivel = this.gameParticipante.getProximoNivel();
    if (this.gameParticipante.getPontos() >= 0) {
      this.razaoPontos = this.pontos / this.pontosNivel * 100;
    } else {
      this.razaoPontos = 0;
    }

    this.conquistaOpiniao = this.gameParticipante.getOpiniao() > 0 ? true : false;
    this.conquistaQuestionario = this.gameParticipante.getQuestionario() > 0 ? true : false;
    this.conquistaTemperatura = this.gameParticipante.getTemperatura() > 0 ? true : false;
    this.conquistaSonoro = this.gameParticipante.getSonoro() > 0 ? true : false;
    this.conquistaAvaliacao = this.gameParticipante.getAvaliacao() > 0 ? true : false;
    this.conquistaCompleto = this.gameParticipante.getCompleto() > 0 ? true : false;

    //--console.log("ID GRUPO=" + this.gameParticipante.getIdGrupoParticipa());
    if (this.gameParticipante.getIdGrupoParticipa() != undefined && this.gameParticipante.getIdGrupoParticipa() != null) {
      this.grupo = this.gameParticipante.getNomeGrupoParticipa();
      this.temGrupo = true;
      this.idGrupo = this.gameParticipante.getIdGrupoParticipa();
      //--console.log("Tem grupo");
    } else {
      //--console.log("Não tem grupo");
      this.temGrupo = false;
      this.idGrupo = null;
      this.grupo = null;
    }

    if (this.gameParticipante.getOpiniao() > 1) {
      this.qtdOpiniao = "x" + this.gameParticipante.getOpiniao();
    } else {
      this.qtdOpiniao = " ";
    }

    if (this.gameParticipante.getQuestionario() > 1) {
      this.qtdQuestionario = "x" + this.gameParticipante.getQuestionario();
    } else {
      this.qtdQuestionario = " ";
    }

    if (this.gameParticipante.getTemperatura() > 1) {
      this.qtdTemperatura = "x" + this.gameParticipante.getTemperatura();
    } else {
      this.qtdTemperatura = " ";
    }

    if (this.gameParticipante.getSonoro() > 1) {
      this.qtdSonoro = "x" + this.gameParticipante.getSonoro();
    } else {
      this.qtdSonoro = " ";
    }

    if (this.gameParticipante.getAvaliacao() > 1) {
      this.qtdAvaliacao = "x" + this.gameParticipante.getAvaliacao();
    } else {
      this.qtdAvaliacao = " ";
    }

    if (this.gameParticipante.getCompleto() > 1) {
      this.qtdCompleto = "x" + this.gameParticipante.getCompleto();
    } else {
      this.qtdCompleto = " ";
    }

    this.medalha = this.gameParticipante.getDiamante();

    this.trofeu = [this.gameParticipante.getTrofeu() == 1 ? true : false,
    this.gameParticipante.getTrofeu() == 2 ? true : false,
    this.gameParticipante.getTrofeu() == 3 ? true : false];

    this.carregado = true;
    //--console.log("DIAM= " + this.gameParticipante.getDiamante());

    if (okCb) okCb();

    ativarTut();
  }

  private mostrarPerfilPesquisado(dados: any, okCb?: () => void) {
    //--console.log("Mostra o perfil carregado");

    this.montaInfos(dados.questionario,
        dados.sonoro,
        dados.avaliacao,
        dados.temperatura,
        dados.completo,
        dados.opiniao,
        dados.diamante);


    this.perfilUsuario = false;
    this.nome = dados.nome;
    this.celular = dados.celular;
    this.sobre = dados.descricao;
    this.imagem = dados.imagem;
    this.pontos = dados.pontos;

    //--console.log("dados.idGrupoParticipa=" + dados.idGrupoParticipa + " --- " + dados.nomeGrupoParticipa);
    if (dados.idGrupoParticipa > 0) {
        this.temGrupo = true;
        this.grupo = dados.nomeGrupoParticipa;
        this.idGrupo = dados.idGrupoParticipa;
    } else {
        this.grupo = null;
        this.idGrupo = null;
        this.temGrupo = false;
    }


    //--console.log("CARREGADO:" + JSON.stringify(dados));
    //--console.log("NIVEL:" + dados.nivel);
    this.nivel = dados.nivel;
    this.pontosNivel = dados.proximoNivel;

    if (this.pontos >= 0) {
        this.razaoPontos = this.pontos / this.pontosNivel * 100;
    } else {
        this.razaoPontos = 0;
    }


    this.conquistaOpiniao = dados.opiniao > 0 ? true : false;
    this.conquistaQuestionario = dados.questionario > 0 ? true : false;
    this.conquistaTemperatura = dados.temperatura > 0 ? true : false;
    this.conquistaSonoro = dados.sonoro > 0 ? true : false;
    this.conquistaAvaliacao = dados.avaliacao > 0 ? true : false;
    this.conquistaCompleto = dados.completo > 0 ? true : false;

    if (dados.opiniao > 1) {
        this.qtdOpiniao = "x" + dados.opiniao;
    } else {
        this.qtdOpiniao = " ";
    }

    if (dados.questionario > 1) {
        this.qtdQuestionario = "x" + dados.questionario;
    } else {
        this.qtdQuestionario = " ";
    }

    if (dados.temperatura > 1) {
        this.qtdTemperatura = "x" + dados.temperatura;
    } else {
        this.qtdTemperatura = " ";
    }

    if (dados.sonoro > 1) {
        this.qtdSonoro = "x" + dados.sonoro;
    } else {
        this.qtdSonoro = " ";
    }

    if (dados.avaliacao > 1) {
        this.qtdAvaliacao = "x" + dados.avaliacao;
    } else {
        this.qtdAvaliacao = " ";
    }

    if (dados.completo > 1) {
        this.qtdCompleto = "x" + dados.completo;
    } else {
        this.qtdCompleto = " ";
    }

    this.medalha = dados.diamante;

    this.trofeu = [dados.trofeu == 1 ? true : false,
    dados.trofeu == 2 ? true : false,
    dados.trofeu == 3 ? true : false];

    this.carregado = true;
    if (okCb) okCb();
}



  montaInfos(qtdQuestionario: number, qtdSonoro: number, qtdAvaliacao: number, qtdTermico: number, qtdCompleto: number, qtdOpiniao: number, diamante: boolean) {

    this.gameConfig.carregar(() => {

      //let ptsGanhosOpiniao = Math.round((10-Math.sqrt(this.gameConfig.getPA_opiniao()*qtdOpiniao))*(Math.sqrt(this.gameConfig.getPB_opiniao()*qtdOpiniao)));

      let ptsProxOpiniao = Number((this.gameConfig.calculaPtsOpiniao((Number.parseInt(qtdOpiniao + "") + 1)) - this.gameConfig.calculaPtsOpiniao(qtdOpiniao)).toFixed(2));
      let ptsPO;
      let mensagemOp = "";
      if (ptsProxOpiniao > 0) {
        ptsPO = "+" + ptsProxOpiniao;
        mensagemOp = "Você tem mais <b>" + (this.gameConfig.getQtdMaxOpiniaoGanha() - qtdOpiniao) + "</b> opiniões até começar a perder pontos.";
      } else {
        ptsPO = ptsProxOpiniao;

        mensagemOp = "<b>Você já está perdendo pontos por excesso de opinião!</b>";
      }

      this.conquistas = [{ nome: 'Conquista de Opinião', desc: '<html>É ganha a cada opinião dada. Porém, seus pontos são proporcionais à quantidade de opiniões.<br><br><b>' + this.gameConfig.calculaPtsOpiniao(qtdOpiniao) + '</b> pontos ganhos! <br>Você ' + (ptsPO >= 0 ? 'ganhará ' : 'perderá ') + '<b>' + ptsPO + '</b> ponto(s) se enviar mais uma opinião.<br><br><b>Atenção:</b> opiniões "desnecessárias" ou demasiadas (mais que ' + this.gameConfig.getQtdMaxOpiniaoGanha() + '), podem ser punidas. <br><br>' + mensagemOp + '</html>' },
      { nome: 'Conquista Resposta de Questionário', desc: '<html>É ganha a cada questionário respondido.<br><br><b>' + this.gameConfig.getPontosQuestionario() + '</b> pontos por conquista.  <br><br><b>' + (this.gameConfig.getPontosQuestionario() * qtdQuestionario) + '</b> pontos ganhos!<br><b>Responda apenas os questionários de feedback e das atividades das quais você participou.</b></html>' },
      { nome: 'Conquista Avaliação de Temperatura', desc: '<html>É ganha a cada avaliação de temperatura de uma atividade.<br><br><b>' + this.gameConfig.getPontosTermico() + '</b> pontos por conquista. <br><br><b>' + (this.gameConfig.getPontosTermico() * qtdTermico) + '</b> pontos ganhos!</html>' },
      { nome: 'Conquista Avaliação Sonora', desc: '<html>É ganha a cada avaliação sonora de uma atividade.<br><br><b>' + this.gameConfig.getPontosSonoro() + '</b> pontos por conquista. <br><br><b>' + (this.gameConfig.getPontosSonoro() * qtdSonoro) + '</b> pontos ganhos!</html>' },
      { nome: 'Conquista Avaliação de Atividade', desc: '<html>É ganha a cada avaliação de uma atividade.<br><br><b>' + this.gameConfig.getPontosAvaliacao() + '</b> pontos por conquista. <br><br><b>' + (this.gameConfig.getPontosAvaliacao() * qtdAvaliacao) + '</b> pontos ganhos!</html>' },
      { nome: 'Conquista Atividade Completa', desc: '<html>É ganha a cada vez que uma atividade é avaliada em todos os quesitos (avaliação, conforto térmico e conforto sonoro) .<br><br><b>' + this.gameConfig.getPontosCompleto() + '</b> pontos por conquista. <br><br><b>' + (this.gameConfig.getPontosCompleto() * qtdCompleto) + '</b> pontos ganhos!</html>' },
      { nome: 'Conquista Avaliação de Qualidade de Vídeo', desc: '<html>É ganha a cada avaliação de qualidade de vídeo de uma atividade.<br><br><b>' + this.gameConfig.getPontosTermico() + '</b> pontos por conquista. <br><br><b>' + (this.gameConfig.getPontosTermico() * qtdTermico) + '</b> pontos ganhos!</html>' },
      { nome: 'Conquista Avaliação de Qualidade de Áudio', desc: '<html>É ganha a cada avaliação de qualidade de áudio de uma atividade.<br><br><b>' + this.gameConfig.getPontosSonoro() + '</b> pontos por conquista. <br><br><b>' + (this.gameConfig.getPontosSonoro() * qtdSonoro) + '</b> pontos ganhos!</html>' }
      ];

      let ptsMedalha = 0;
      if (diamante) {
        ptsMedalha = this.gameConfig.getPontosDiamante();
      }

      this.descMedalha = {
        nome: 'Medalha de Diamante',
        desc: '<html>É ganha quando todos os questionários do evento são respondidos. <br><br>Valor: <b>' + this.gameConfig.getPontosDiamante() + '</b> pontos. <br><br><b>' + (ptsMedalha) + '</b> ponto(s) ganho(s)</html>'
      };


      this.insigniasDesc = [{ nome: 'Nível 1', desc: '<html>Nível inicial de todos os participantes.' }, //nível 1
      { nome: 'Nível 2', desc: '<html>Para subir para o nível <b>2</b> e ganhar essa insígnia, é preciso acumular <b>' + this.gameConfig.getPtsNivel2() + '</b> pontos. </html>' },//nível 2
      { nome: 'Nível 3', desc: '<html>Para subir para o nível <b>3</b> e ganhar essa insígnia, é preciso acumular <b>' + this.gameConfig.getPtsNivel3() + '</b> pontos. </html>' },//nível 3
      { nome: 'Nível 4', desc: '<html>Para subir para o nível <b>4</b> e ganhar essa insígnia, é preciso acumular <b>' + this.gameConfig.getPtsNivel4() + '</b> pontos. </html>' },//nível 4
      { nome: 'Nível 5', desc: '<html>Para subir para o nível <b>5</b> e ganhar essa insígnia, é preciso acumular <b>' + this.gameConfig.getPtsNivel5() + '</b> pontos. </html>' },//nível 5
      { nome: 'Nível 6', desc: '<html>Para subir para o nível <b>6</b> e ganhar essa insígnia, é preciso acumular <b>' + this.gameConfig.getPtsNivel6() + '</b> pontos. </html>' },//nível 6
      { nome: 'Nível 7', desc: '<html>Para subir para o nível <b>7</b> e ganhar essa insígnia, é preciso acumular <b>' + this.gameConfig.getPtsNivel7() + '</b> pontos. </html>' },//nível 7
      { nome: 'Nível 8', desc: '<html>Para subir para o nível <b>8</b> e ganhar essa insígnia, é preciso acumular <b>' + this.gameConfig.getPtsNivel8() + '</b> pontos. </html>' },//nível 8
      { nome: 'Nível 9', desc: '<html>Para subir para o nível <b>9</b> e ganhar essa insígnia, é preciso acumular <b>' + this.gameConfig.getPtsNivel9() + '</b> pontos. </html>' },//nível 9
      { nome: 'Nível 10', desc: '<html>Para subir para o nível <b>10</b> e ganhar essa insígnia, é preciso acumular <b>' + this.gameConfig.getPtsNivel10() + '</b> pontos.</html>' }];//nível 10

    });


  }

  private async  mostraAlerta(titulo: string, subtitulo: string) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      subHeader: subtitulo,
      buttons: ['Ok']
    });
    await alert.present();
  }

  public infoConquista(tipo: number) {
    this.mostraAlerta(this.conquistas[tipo - 1].nome,
      this.conquistas[tipo - 1].desc);
  }

  public infoMedalha() {
    this.mostraAlerta(this.descMedalha.nome,
      this.descMedalha.desc);
  }

  public infoTrofeu(tipo: number) {
    this.mostraAlerta(this.trofeus[tipo - 1].nome,
      this.trofeus[tipo - 1].desc);
  }


  public infoInsignia(nivel: number) {
    this.mostraAlerta(this.insigniasDesc[nivel - 1].nome,
      this.insigniasDesc[nivel - 1].desc);
  }

  irParaEditarPerfil() {
    this.router.navigate(['/edita-evento']);
  }

  irParaGrupo() {

      this.router.navigate(['/grupo'], { queryParams: { idGrupo: this.idGrupo, primeira: true } });

}

  irParaCriarGrupo() {
    this.router.navigate(['/cria-grupo'])
  }

  irParaRanking() {

    this.router.navigate(['/ranking-page'], { queryParams: { tipo: 1, primeira: true }});
  }



  ajudaGeral() {
    this.mostraAlerta("Geral",
      "<html>" +
      "Você pode atualizar os dados puxando a página para baixo.<br><br>" +
      "Ganhe <b>pontos e conquistas</b> avaliando as atividades e opinando.<br><br>" +
      "Veja o <b>ranking</b> dos melhores colocados. (no canto superior esquerdo)<br><br>" +
      "Veja as <b>avaliações</b> e <b>comentários</b> das atividades. (através do ranking)<br><br>" +
      "Utilize <b>hashtags</b> ao dar opiniões para que seja visível aos outros participantes. (em opinar)<br><br>" +
      "Crie ou participe de um <b>grupo</b> para interagir com seus amigos. (busque grupos no ranking)" +
      "</html>");
  }

  ajudaConquistas() {
    let qtdPtsMax = this.gameConfig.calculaPtsOpiniao(this.gameConfig.getQtdMaxOpiniaoGanha());
    //--console.log("----" + this.gameConfig.getQtdMaxOpiniaoGanha());
    //--console.log("==" + qtdPtsMax);
    this.mostraAlerta("Conquistas",
      "<html>" +
      "Você ganha as conquistas a cada opinião dada, questionário respondido, atividade avaliada nos quesitos nota, conforto térmico e sonoro. <br>Além disso, ganha um bônus quando avalia por completo uma atividade!<br><br>" +
      "<b>Tabela de pontos:</b><br>" +
      "<b>Opinião:</b> variável conforme a quantidade (máximo " + qtdPtsMax + ") pontos<br>" +
      "<b>Questionário:</b> " + this.gameConfig.getPontosQuestionario() + " pontos<br>" +
      "<b>Conforto Térmico:</b> " + this.gameConfig.getPontosTermico() + " pontos<br>" +
      "<b>Conforto Sonoro:</b> " + this.gameConfig.getPontosSonoro() + " pontos<br>" +
      "<b>Avaliação Atividade:</b> " + this.gameConfig.getPontosAvaliacao() + " pontos<br>" +
      "<b>Atividade Completa:</b> " + this.gameConfig.getPontosCompleto() +
      "</html>");
  }

  ajudaMedalhaTrofeu() {
    this.mostraAlerta("Troféus",
      "<html>" +
      "Ao final do evento, os primeiros colocados ganham os troféus de 1°, 2° e 3° lugares. <br><br>" +
      "<b>Tabela de pontos:</b><br>" +
      //"<b>Medalha de diamante:</b> " + this.gameConfig.getPontosQuestionario() + " pontos<br>" +//
      "<b>Troféu 1°:</b> Nenhum ponto<br>" +
      "<b>Troféu 2°:</b> Nenhum ponto<br>" +
      "<b>Troféu 3°:</b> Nenhum ponto<br>" +
      "</html>");
  }

  ajudaInsignia() {
    this.mostraAlerta("Insígnia",
      "<html>" +
      "Você ganha uma insígnia a cada vez que sobre de nível. <br>Para subir de nível, basta atingir os pontos: <br><br>" +
      "<b>Tabela de pontos:</b><br>" +
      "<b>Nível 1:</b> nível inicial<br>" +
      "<b>Nível 2:</b> " + this.gameConfig.getPtsNivel2() + " pontos<br>" +
      "<b>Nível 3:</b> " + this.gameConfig.getPtsNivel3() + " pontos<br>" +
      "<b>Nível 4:</b> " + this.gameConfig.getPtsNivel4() + " pontos<br>" +
      "<b>Nível 5:</b> " + this.gameConfig.getPtsNivel5() + " pontos<br>" +
      "<b>Nível 6:</b> " + this.gameConfig.getPtsNivel6() + " pontos<br>" +
      "<b>Nível 7:</b> " + this.gameConfig.getPtsNivel7() + " pontos<br>" +
      "<b>Nível 8:</b> " + this.gameConfig.getPtsNivel8() + " pontos<br>" +
      "<b>Nível 9:</b> " + this.gameConfig.getPtsNivel9() + " pontos<br>" +
      "<b>Nível 10:</b> " + this.gameConfig.getPtsNivel10() + " pontos<br>" +
      "</html>");
  }

}
