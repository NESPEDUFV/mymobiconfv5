import { EventoService } from './../../../services/evento.service';
import { GameParticipanteService } from './../../../services/game/participante.service';
import { OverlayService } from 'src/app/services/overlay.service';
import { ConfigService } from './../../../services/config.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';
import { ConfiguracoesService } from 'src/app/services/game/configuracoes.service';
import { GameRankingService } from 'src/app/services/game/game-ranking.service';
import { PassosMsgs, PassosTutorial } from 'src/app/components/tutorial/passos';

@Component({
  selector: 'app-ranking-page',
  templateUrl: './ranking-page.page.html',
  styleUrls: ['./ranking-page.page.scss'],
})
export class RankingPagePage implements OnInit {

  /** @ignore */
  @ViewChild('tutTabela1', { read: ElementRef }) tutTabela1: ElementRef;
  /** @ignore */
  @ViewChild('tutTabela2', { read: ElementRef }) tutTabela2: ElementRef;
  /** Controla quando o tutorial é ativado */
  ativarTut: boolean = false;
  /** Passos do tutorial desta página */
  passos: { el: ElementRef, msg: string }[] = [];

  public naoFecharAoSair = false; //não excluir a pagina quando for a primeira aberta
  public dadosCarregados = false;

  public nome = "Nome do Grupo";
  public donoGrupo = true;

  public pedidos = true;

  public opcao = 1;
  public subOpcao = 1;

  public carregado: any = [{
      o1_1: false, o1_2: false, o1_3: false,
      o2_1: false, o2_2: false,
      o3_1: false,
      o3_2: false,
      o3_3: false,
      o3_4: false
  }];


  public listaUsuariosPontos;
  public listaUsuariosAvaliacoes;
  public listaUsuariosComentarios;

  public listaAtividadesAvaliacoes;
  public listaAtividadesComentarios;

  public listaGruposPontos;
  public listaGruposMembros;
  public listaGruposAvaliacoes;
  public listaGruposComentarios;

  public listaUsuarios = [];

  public listaAtividades = [];

  public listaGrupos = [];


  public participantes = [];

  public numParticipantes = this.participantes.length;

  public pedidosParticipantes = [];

  public numPedidos = this.pedidosParticipantes.length;

  public status;

  public escondeuRanking;

  public diaFim;

  //private eventoAcabou = 0;     Este campo era utilizado para analisar a data do evento e verificar se ele tinha acabado

  constructor(public router: Router,
    public route: ActivatedRoute, private alertCtrl: AlertController,
         private config: ConfigService, public loadingCtrl: LoadingController,
        platform: Platform, private overlay: OverlayService, private usuario: UsuarioService,
        private gameParticipante: GameParticipanteService,
        private gameConfig: ConfiguracoesService,
        private gameRanking: GameRankingService,
        private evento: EventoService) {

          const primeira = this.route.snapshot.queryParamMap.get('primeira');
          const tipo = this.route.snapshot.queryParamMap.get('tipo');
          console.log("construtor", primeira);
          console.log("construtor", tipo);
          if (primeira !== null) {
            this.naoFecharAoSair = primeira === 'true';
          }
        //this.pedidos = navCtrl['pedidos'];
        //--console.log("Tipo = " + navParams.get('tipo'));
        if (tipo != undefined) {
            this.opcao = parseInt(tipo, 10); // converte a string para number usando base 10
            this.mostrarRanking();
        }
  }

  ionViewWillEnter() {
    this.gameConfig.carregarConfiguracoes(() => {}, () => {});
    this.carregarDadosParticipante();

    this.status = this.gameConfig.getStatus();
    this.escondeuRanking = this.gameConfig.getEscondeuRanking();

    console.log('status: ', this.status);
    console.log('escondeuRanking: ', this.escondeuRanking);
    if (this.escondeuRanking!="1" || (this.status=="1")){
      console.log('this.passos antes', this.passos);
      if (!this.config.tutorialFoiVisto(PassosTutorial.Ranking)) {
        this.passos[0].el = this.tutTabela1;
        this.passos[1].el = this.tutTabela2;
        this.ativarTut = true;
    }

    }

}

  ngOnInit() {
    if (!this.config.tutorialFoiVisto(PassosTutorial.Ranking)) {
      this.passos = [
          { el: this.tutTabela1, msg: PassosMsgs[PassosTutorial.Ranking][0] },
          { el: this.tutTabela2, msg: PassosMsgs[PassosTutorial.Ranking][1] },
      ];
      console.log('this.passos depois', this.passos);
      this.ativarTut = true;
  }

  }

  viuTutorial(passo: number) {
    if (passo == -1 || passo == this.passos.length) {
        this.ativarTut = false;
        this.config.tutorialMarcarVisto(PassosTutorial.Ranking);
    }
}

carregarDadosParticipante() {
  this.gameParticipante.carregar(() => { //carrega dados
      //--console.log("Dados participante carregados");
  });
}

mostrarRanking() {
  this.status = this.gameConfig.getStatus();
  this.dadosCarregados = false;
  switch (this.opcao) {
      case 1: //usuarios
          switch (this.subOpcao) {
              case 1: //pontos
                  if (!this.carregado.o1_1) { //ainda nao carregado
                      this.carregarUsuarios(1);
                  } else { //ja carregado
                      this.listaUsuarios = this.listaUsuariosPontos;
                      this.dadosCarregados = true;
                  }
                  break;

              case 2: //avaliacoes
                  if (!this.carregado.o1_2) { //ainda nao carregado
                      this.carregarUsuarios(2);
                  } else { //ja carregado
                      this.listaUsuarios = this.listaUsuariosAvaliacoes;
                      this.dadosCarregados = true;
                  }
                  break;

              case 3: //opinioes
                  if (!this.carregado.o1_3) { //ainda nao carregado
                      this.carregarUsuarios(3);
                  } else { //ja carregado
                      this.listaUsuarios = this.listaUsuariosComentarios;
                      this.dadosCarregados = true;
                  }
                  break;
          }
          break;

      case 2: //atividades
          switch (this.subOpcao) {
              case 1: //avaliacao
                  if (!this.carregado.o2_1) { //ainda nao carregado
                      this.carregarAtividades(1);
                  } else { //ja carregado
                      this.listaAtividades = this.listaAtividadesAvaliacoes;
                      this.dadosCarregados = true;
                  }
                  break;

              case 2: //comentarios
                  if (!this.carregado.o2_2) { //ainda nao carregado
                      this.carregarAtividades(2);
                  } else { //ja carregado
                      this.listaAtividades = this.listaAtividadesComentarios;
                      this.dadosCarregados = true;
                  }
                  break;
          }
          break;

      case 3: //grupos
          switch (this.subOpcao) {
              case 1: //pontos
                  if (!this.carregado.o3_1) { //ainda nao carregado
                      this.carregarGrupos(1);
                  } else { //ja carregado
                      this.listaGrupos = this.listaGruposPontos;
                      this.dadosCarregados = true;
                  }
                  break;

              case 2: //membros
                  if (!this.carregado.o3_2) { //ainda nao carregado
                      this.carregarGrupos(2);
                  } else { //ja carregado
                      this.listaGrupos = this.listaGruposMembros;
                      this.dadosCarregados = true;
                  }
                  break;

              case 3: //avaliacao
                  if (!this.carregado.o3_3) { //ainda nao carregado
                      this.carregarGrupos(3);
                  } else { //ja carregado
                      this.listaGrupos = this.listaGruposAvaliacoes;
                      this.dadosCarregados = true;
                  }
                  break;

              case 4: //comentarios
                  if (!this.carregado.o3_4) { //ainda nao carregado
                      this.carregarGrupos(4);
                  } else { //ja carregado
                      this.listaGrupos = this.listaGruposComentarios;
                      this.dadosCarregados = true;
                  }
                  break;
          }
          break;
  }
}

carregarUsuarios(tipo: number) {

  this.overlay.createLoading( "Aguarde..." );
  if(this.status=="1" && tipo==1){
      this.gameRanking.listarUsuariosEncerrado(this.gameParticipante.getIDEvento(),  (participantes: any) => {
          //console.log("CHEGOU>" + JSON.stringify(participantes));

          switch (tipo) {
              case 1:
                  this.listaUsuariosPontos = participantes;
                  this.listaUsuarios = participantes;
                  console.log(this.listaUsuarios);
                  this.carregado.o1_1 = true;
                  this.dadosCarregados = true;
                  this.overlay.dismissAllLoaders();
                  break;
          }

      }, () => {
          this.listaUsuarios = [];
          this.overlay.dismissAllLoaders();
          this.mostraAlerta("Erro ao carregar dados do servidor!", "Não há dados para mostrar.");
      }, () => {
        this.overlay.dismissAllLoaders();
          this.mostraAlerta("Erro ao carregar dados do servidor!", "Não há dados para mostrar.");
          this.router.navigate(['../'], { relativeTo: this.route }); // volta para a página anterior
      });
  }else{
      this.gameRanking.listarUsuarios(this.gameParticipante.getIDEvento(), tipo, (participantes: any) => {
          //--console.log("CHEGOU>" + JSON.stringify(participantes));

          switch (tipo) {
              case 1:
                  this.listaUsuariosPontos = participantes;
                  this.listaUsuarios = participantes;
                  this.carregado.o1_1 = true;
                  this.dadosCarregados = true;
                  this.overlay.dismissAllLoaders();
                  break;

              case 2:
                  this.listaUsuariosAvaliacoes = participantes;
                  this.listaUsuarios = participantes;
                  this.carregado.o1_2 = true;
                  this.dadosCarregados = true;
                  this.overlay.dismissAllLoaders();
                  break;

              case 3:
                  this.listaUsuariosComentarios = participantes;
                  this.listaUsuarios = participantes;
                  this.carregado.o1_3 = true;
                  this.dadosCarregados = true;
                  this.overlay.dismissAllLoaders();
                  break;
          }

      }, () => {
          this.listaUsuarios = [];
          this.overlay.dismissAllLoaders();
          this.mostraAlerta("Erro ao carregar dados do servidor!", "Não há dados para mostrar.");
      }, () => {
          this.overlay.dismissAllLoaders();
          this.mostraAlerta("Erro ao carregar dados do servidor!", "Não há dados para mostrar.");
          this.router.navigate(['../'], { relativeTo: this.route }); // volta para a página anterior
      });
  }
}

carregarAtividades(tipo: number) {
  let loading = this.overlay.createLoading("Aguarde..." );

  this.gameRanking.listarAtividades(this.gameParticipante.getIDEvento(), tipo, (atividades: any) => {
      //--console.log("CHEGOU>" + JSON.stringify(atividades));

      switch (tipo) {
          case 1:
              this.listaAtividades = atividades;
              this.listaAtividadesAvaliacoes = atividades;
              this.carregado.o2_1 = true;
              this.dadosCarregados = true;
              this.overlay.dismissAllLoaders();
              break;

          case 2:
              this.listaAtividades = atividades;
              this.listaAtividadesComentarios = atividades;
              this.carregado.o2_2 = true;
              this.dadosCarregados = true;
              this.overlay.dismissAllLoaders();
              break;

      }

  }, () => {
      this.listaAtividades = [];
      this.overlay.dismissAllLoaders();
      this.mostraAlerta("Erro ao carregar dados do servidor!", "Não há dados para mostrar.");
  }, () => {
      this.overlay.dismissAllLoaders();
      this.mostraAlerta("Erro ao carregar dados do servidor!", "Não há dados para mostrar.");
      this.router.navigate(['../'], { relativeTo: this.route }); // volta para a página anterior
  });
}


carregarGrupos(tipo: number) {
  let loading = this.overlay.createLoading("Aguarde..." );


  this.gameRanking.listarGrupos(this.gameParticipante.getIDEvento(), tipo, (grupos: any) => {
      //--console.log("CHEGOU GRUPOS>" + JSON.stringify(grupos));

      switch (tipo) {
          case 1: //pontos
              this.listaGrupos = grupos;
              this.listaGruposPontos = grupos;
              this.carregado.o3_1 = true;
              this.dadosCarregados = true;
              this.overlay.dismissAllLoaders();
              break;

          case 2://membros
              this.listaGrupos = grupos;
              this.listaGruposMembros = grupos;
              this.carregado.o3_2 = true;
              this.dadosCarregados = true;
              this.overlay.dismissAllLoaders();
              break;

          case 3: //avaliaçoes
              this.listaGrupos = grupos;
              this.listaGruposAvaliacoes = grupos;
              this.carregado.o3_3 = true;
              this.dadosCarregados = true;
              this.overlay.dismissAllLoaders();
              break;

          case 4: //comentarios
              this.listaGrupos = grupos;
              this.listaGruposComentarios = grupos;
              this.carregado.o3_4 = true;
              this.dadosCarregados = true;
              this.overlay.dismissAllLoaders();
              break;
      }

  }, () => {
      this.listaGrupos = [];
      this.overlay.dismissAllLoaders();
      this.mostraAlerta("Erro ao carregar dados do servidor!", "Não há dados para mostrar.");
  }, () => {
      this.overlay.dismissAllLoaders();
      this.mostraAlerta("Erro ao carregar dados do servidor!", "Não há dados para mostrar.");
      this.router.navigate(['../'], { relativeTo: this.route }); // volta para a página anterior
  });
}


async mostraAlerta(titulo: string, subtitulo: string) {
  const alert = await this.alertCtrl.create({
    header: titulo,
    subHeader: subtitulo,
    buttons: ['Ok']
  });
  await alert.present();
}

irParaPerfil(id: number) {
  if (!this.naoFecharAoSair) {
      this.router.navigate(['../'], { relativeTo: this.route }); // volta para a página anterior
      //--console.log("IR PARA ID=" + id);
      this.router.navigate(['/perfil-game'], {
        queryParams: { idUser: id}
      });

  } else {
    this.router.navigate(['/perfil-game'], {
      queryParams: { idUser: id}
    });
  }

}

irParaAtividade(id: number) {
  if (!this.naoFecharAoSair) {
    //adicionar animação
      this.router.navigate(['/atividade-game'], {queryParams: {id: id}})
  } else {
    this.router.navigate(['/atividade-game'], {queryParams: {id: id}})
  }
}

irParaGrupo(id: number) {
  if (!this.naoFecharAoSair) {
     //adicionar animação
    this.router.navigate(['/grupo'], {queryParams: {id: id}})
  } else {
    this.router.navigate(['/grupo'], {queryParams: {id: id}})
  }
}


mudaOpcao(op: number) {
  this.opcao = op;
  this.subOpcao = 1;
  this.mostrarRanking();
}

mudaSubOpcao(op: number) {
  this.subOpcao = op;
  this.mostrarRanking();
}

  /**
     * Carrega a lista de perguntas, também chamada ao se puxar o refresher
     * @param refresher Refresher da página
     */
  carregar(refresher?) {
    this.gameConfig.carregarConfiguracoes(() => {}, () => {});
    this.carregarDadosParticipante();

    this.status = this.gameConfig.getStatus();
    this.escondeuRanking = this.gameConfig.getEscondeuRanking();
    if (refresher) refresher.complete();
}



}
