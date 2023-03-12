import { GameParticipanteService } from 'src/app/services/game/participante.service';
// Evento
// Armazena os dados do evento em que o usuário está inscrito

import { Injectable } from '@angular/core';
import { ServidorService } from './../servidor/servidor.service';
import { ArmazenamentoService } from './../armazenamento.service';


export interface GameGrupoInterface {
  idGrupo: number
  idProprietario: number
  nomeProprietario: string
  idEvento: number
  nome: string
  descricao: string
  imagem: number
  identificador: string
  diamante: number
  trofeu1: boolean
  trofeu2: boolean
  trofeu3: boolean
  nivel: number
  pontos: number
  avaliacaoUsuarios: number
  opiniao: number
  questionario: number
  temperatura: number
  sonoro: number
  avaliacao: number
  completo: number
  participantes: any
  qtdParticipantes: number
}

/*export interface GameComentarioInterface {
  idUsuario: string
  nomeUsuario: string
  comentario: string
}*/

@Injectable({
  providedIn: 'root'
})
export class GamegrupoService {
  private dados: GameGrupoInterface;

  constructor(private storage: ArmazenamentoService, private servidor: ServidorService, private gameParticipante: GameParticipanteService) { }

   //Gets e sets
   getID(): number {
    if(this.dados != undefined){
        return this.dados.idGrupo;
    }else{
        return null;
    }

}

getIDEvento(): number {
    if(this.dados != undefined){
        return this.dados.idEvento;
    }else{
        return null;
    }
}

getNome(): string {
    if(this.dados != undefined){
        return this.dados.nome;
    }else{
        return null;
    }
}

getIdentificador(): string {
    if(this.dados != undefined){
        return this.dados.identificador;
    }else{
        return null;
    }
}

getDescricao(): string {
    if(this.dados != undefined){
        return this.dados.descricao;
    }else{
        return null;
    }
}


getDiamante(): number {
    if(this.dados != undefined){
        return this.dados.diamante;
    }else{
        return null;
    }
}

getTrofeu1(): boolean {
    if(this.dados != undefined){
        return this.dados.trofeu1;
    }else{
        return null;
    }
}

getTrofeu2(): boolean {
    if(this.dados != undefined){
        return this.dados.trofeu2;
    }else{
        return null;
    }
}

getTrofeu3(): boolean {
    if(this.dados != undefined){
        return this.dados.trofeu3;
    }else{
        return null;
    }
}

getNivel(): number {
    if(this.dados != undefined){
        return this.dados.nivel;
    }else{
        return null;
    }
}

getPontos(): number {
    if(this.dados != undefined){
        return this.dados.pontos;
    }else{
        return null;
    }
}

getAvaliacaoUsuarios(): number {
    if(this.dados != undefined){
        return this.dados.avaliacaoUsuarios;
    }else{
        return null;
    }
}

getImagem(): number {
    if(this.dados != undefined){
        return this.dados.imagem;
    }else{
        return null;
    }
}

getOpiniao(): number {
    if(this.dados != undefined){
        return this.dados.opiniao;
    }else{
        return null;
    }
}

getQuestionario(): number {
    if(this.dados != undefined){
        return this.dados.questionario;
    }else{
        return null;
    }
}

getTemperatura(): number {
    if(this.dados != undefined){
        return this.dados.temperatura;
    }else{
        return null;
    }
}

getSonoro(): number {
    if(this.dados != undefined){
        return this.dados.sonoro;
    }else{
        return null;
    }
}

getAvaliacao(): number {
    if(this.dados != undefined){
        return this.dados.avaliacao;
    }else{
        return null;
    }
}

getCompleto(): number {
    if(this.dados != undefined){
        return this.dados.completo;
    }else{
        return null;
    }
}

/*getComentarios(cb?: () => void):any{
    if(this.comentarios != undefined){
        return this.comentarios;
    }else{
        return null;
    }
}*/

getIdProprietario(): number {
    if(this.dados != undefined){
        return this.dados.idProprietario;
    }else{
        return null;
    }
}

getNomeproprietario(): string {
    if(this.dados != undefined){
        return this.dados.nomeProprietario;
    }else{
        return null;
    }
}

getParticipantes(): any[] {
    if(this.dados != undefined){
        return this.dados.participantes;
    }else{
        return null;
    }
}

getQtdParticipantes(): number {
    if(this.dados != undefined){
        return this.dados.qtdParticipantes;
    }else{
        return null;
    }
}


addParticipante(){
    this.dados.qtdParticipantes++;
}

/**
 * @return Se há dados no evento
 */
existeDados(): boolean {
    ////--console.log("Dados grupo salvo: " + JSON.stringify(this.dados));
    ////--console.log("AQUI" + this.dados != null);
    return this.dados != null;
}

/**
 * Carrega os dados do evento salvos no armazenamento local
 * @param cb (opcional) Callback para ser executada quando termina de carregar
 */
carregar(cb?: () => void) {
    this.gameParticipante.carregar(()=>{

        if(this.gameParticipante.getIdGrupoParticipa() != null && this.gameParticipante.getIdGrupoParticipa() != undefined){
            this.storage.get('game_grupo').then((val) => {
                ////--console.log("Carregou:" + val);
                this.dados = JSON.parse(val);
                if (cb) cb();
            }, () => {
                this.dados = null;
            });

        }else{
            this.apagar();
            if (cb) cb();
        }


    });
}

/*carregarComentarios(cb?: () => void) {
    this.storage.get('game_comentarios_grupo').then((val) => {
        ////--console.log("CarregouComentarios:" + val);
        this.comentarios = JSON.parse(val);
        if (cb) cb();
    }, () => {
        this.comentarios = null;
    });
}*/

/**
 * Salva os dados do evento passado no armazenamento local
 * @param evento Dados do evento
 */
salvar(okCb?: () => void) {
    ////--console.log("SALVANDO:"+JSON.stringify(this.dados));
    this.storage.setObservable('game_grupo', JSON.stringify(this.dados)).subscribe(()=>{
        if(okCb) okCb();
    });
}

/*salvarComentarios() {
    ////--console.log("Salva = " + JSON.stringify(this.comentarios));
    this.storage.set('game_comentarios_grupo', JSON.stringify(this.comentarios));
}*/

cadastrarGrupo(idParticipante: any, idEvento: any, nome:string, descricao:string, imagem:number,identificador:string, okCb: () => void, erroCb: () => void) {
    this.servidor.game_grupo.criarGrupo(idParticipante,idEvento,nome,descricao,imagem,identificador).subscribe((val: any) => {
        if (val.success == 1) { //cadastrado com sucesso
            val.grupo.diamante = val.grupo.diamante == 0 ? false : true;
            this.dados = val.grupo;
            this.salvar();
            this.gameParticipante.cadastrarParticipante(idParticipante,idEvento,()=>{
                okCb();
            },()=>{});

        } else {
            this.dados = null;
            this.salvar();
            erroCb();
        }

    }, () => {


    });
}

editarGrupo(idGrupo: any, nome:string, descricao:string, imagem:number, okCb: () => void, erroCb: () => void) {
    this.servidor.game_grupo.editarGrupo(idGrupo,nome,descricao,imagem).subscribe((val: any) => {
        if (val.success == 1) { //editado com sucesso
            this.dados.nome = nome;
            this.dados.descricao = descricao;
            this.dados.imagem = imagem;
            this.salvar();
            okCb();
        } else {
            erroCb();
        }

    }, () => {
        erroCb();

    });
}

carregarGrupo(idGrupo: any, idEvento: any, okCb: () => void, erroCb: () => void) {
    this.servidor.game_grupo.visualizarGrupo(idGrupo,idEvento).subscribe((val: any) => {
        if (val.success == 1) { //cadastrado com sucesso
            //val.grupo.diamante = val.grupo.diamante == 0 ? false : true;
            this.dados = val.grupo;
            ////--console.log("SALVAR:"+JSON.stringify(val.grupo));
            this.salvar(()=>{okCb()});

        } else {
            /*this.dados = null;
            this.salvar();*/
            erroCb();
        }

    }, () => {
        if(this.existeDados()){
            okCb();
        }else{
            erroCb();
        }


    });
}

atualizarDados(okCb: () => void, erroCb: () => void) {
    this.servidor.game_grupo.visualizarGrupo(this.getID(),this.getIDEvento()).subscribe((val: any) => {
        if (val.success == 1) { //cadastrado com sucesso
            //val.grupo.diamante = val.grupo.diamante == 0 ? false : true;
            this.dados = val.grupo;
            ////--console.log("SALVAR:"+JSON.stringify(val.grupo));
            this.salvar(()=>{okCb()});

        } else {
            /*this.dados = null;
            this.salvar();*/
            erroCb();
        }

    }, () => {
        erroCb();


    });
}


excluirGrupo(idGrupo: any, idEvento: any, okCb: () => void, erroCb: () => void) {
    this.servidor.game_grupo.excluirGrupo(idGrupo,idEvento).subscribe((val: any) => {
        if (val.success == 1) { //excluido com sucesso
            this.apagar();
            this.gameParticipante.excluirGrupo();
            okCb();

        } else {
            erroCb();
        }

    }, () => {


    });
}

sairGrupo(idGrupo:number, idUsuario: number, okCb: () => void, erroCb: () => void) {
    this.servidor.game_grupo.sairGrupo(idGrupo,idUsuario).subscribe((val: any) => {
        if (val.success == 1) { //excluido com sucesso
            this.apagar();
            okCb();

        } else {
            erroCb();
        }

    }, () => {


    });
}

solicitarEntradaGrupo(idGrupo:number, idUsuario: number, idEvento:number, okCb: () => void, erroCb: () => void) {
    this.servidor.game_grupo.solicitarEntradaGrupo(idGrupo,idUsuario,idEvento).subscribe((val: any) => {
        if (val.success == 1) { //sucesso
            //this.apagar();
            okCb();

        } else {
            erroCb();
        }

    }, () => {


    });
}

aceitarEntradaGrupo(idGrupo:number, idUsuario: number, aceita:boolean, idEvento:number, okCb: () => void, erroCb: () => void) {
    this.servidor.game_grupo.aceitarEntradaGrupo(idGrupo,idUsuario,idEvento,aceita).subscribe((val: any) => {
        if (val.success == 1) { //sucesso
            //this.apagar();
            if(aceita){
                this.addParticipante();
            }
            okCb();

        } else {
            erroCb();
        }

    }, () => {


    });
}

removerParticipanteGrupo(idGrupo:number, idUsuario: number, idEvento:number, okCb: () => void, erroCb: () => void) {
    this.servidor.game_grupo.aceitarEntradaGrupo(idGrupo,idUsuario,idEvento,false).subscribe((val: any) => {
        if (val.success == 1) { //sucesso
            //this.apagar();
            okCb();

        } else {
            erroCb();
        }

    }, () => {


    });
}

cancelarPedidoEntradaGrupo(idGrupo:number, idUsuario: number, idEvento:number, okCb: () => void, erroCb: () => void) {
    this.servidor.game_grupo.aceitarEntradaGrupo(idGrupo,idUsuario,idEvento,false).subscribe((val: any) => {
        if (val.success == 1) { //sucesso
            //this.apagar();
            okCb();

        } else {
            erroCb();
        }

    }, () => {


    });
}

visualizarComentarios(idGrupo:number, idEvento: number, ultimo:number, okCb: (comentarios:any,qtdComentarios:number) => void, erroCb: () => void) {
    this.servidor.game_grupo.visualizarComentarios(idGrupo, idEvento, ultimo).subscribe((val: any) => {
        ////--console.log("recebeu" + JSON.stringify(val));
        if (val.success == 1) {
            ////--console.log("Comentarios: " + val.comentarios);

            /*if(this.getID() == idGrupo){
                this.comentarios = val.comentarios;
                this.salvarComentarios();
            }*/

            okCb(val.comentarios, val.qtdComentarios);
        } else {

            //--console.log("ERRo COMENTARIOS");
            erroCb();
        }

    }, () => {
        /*if(idGrupo != undefined && this.getID() == idGrupo){
            //--console.log("comentários locais");
            if(this.comentarios != null && this.comentarios != undefined){
                okCb(this.comentarios, this.comentarios.length);
            }else{
                erroCb();
            }

        }*/
        erroCb();

    });
}

carregarParticipantes(idGrupo:number, idEvento: number, okCb: (participantes:any) => void, erroCb: () => void) {
    this.servidor.game_grupo.visualizarParticipantes(idGrupo, idEvento).subscribe((val: any) => {
        ////--console.log("recebeu" + JSON.stringify(val));
        if (val.success == 1) {
            ////--console.log("Participantes: " + val.participantes);
            if(this.existeDados()){
                if(this.getID()==idGrupo){
                    this.dados.participantes = val.participantes;
                    this.salvar();
                }
                okCb(val.participantes);
            }else{
                okCb(val.participantes);
            }


        } else {
            //--console.log("ERRo PARTICIPANTES");
            erroCb();
        }

    }, () => {
        erroCb();

    });
}

carregarPedidos(idGrupo:number, idEvento: number, okCb: (participantes:any) => void, erroCb: () => void) {
    this.servidor.game_grupo.visualizarPedidos(idGrupo, idEvento).subscribe((val: any) => {
        ////--console.log("recebeu" + JSON.stringify(val));
        if (val.success == 1) {
            ////--console.log("pedidos: " + val.participantes);

            okCb(val.participantes);
        } else {
            //--console.log("ERRo PEDIDOS");
            erroCb();
        }

    }, () => {


    });
}

visualizarGrupo(idGrupo:number, idEvento: number, okCb: (grupo:any) => void, erroCb: () => void) {
    this.servidor.game_grupo.visualizarGrupo(idGrupo, idEvento).subscribe((val: any) => {
        ////--console.log("recebeu" + JSON.stringify(val));
        if (val.success == 1) {
            ////--console.log("Grupo retornado: " + val.grupo);


            okCb(val.grupo);
        } else {
            //--console.log("ERRo GRUPO");
            erroCb();
        }

    }, () => {


    });
}


/*    editarPerfil(nome: string, celular: string, descricao: string, imagem: number, okCb: () => void, erroCb: () => void) {
    this.servidor.game_participante.editarUsuario(this.getID(), this.getIDEvento(), nome, celular, descricao, imagem).subscribe((val: any) => {
        if (val['success']) {
            this.dados.nome = nome;
            this.dados.celular = celular;
            this.dados.descricao = descricao;
            this.dados.imagem = imagem;
            this.salvar();
            //--console.log("Sucesso!!!!!!!!!");
            okCb();
        } else {
            erroCb();
        }

    }, () => {
        //--console.log("ERRO!!!!!!!!!");

    });
}

excluirPerfil(okCb: () => void, erroCb: () => void) {
    this.servidor.game_participante.excluirPerfil(this.getID(), this.getIDEvento()).subscribe((val: any) => {
        if (val['success']) {
            this.apagar();
            okCb();
        } else {
            erroCb();
        }

    }, () => {
        //--console.log("ERRO!!!!!!!!!");
        erroCb();

    });
}

removerParticipanteLocal() {
    this.dados = null;
    this.salvar();
}

/**
 * Busca as informações extras sobre o evento
 * @param cb Callback para quando termina de buscar as informações
 */
buscarInfo(cb?: () => void) {
    /*this.servidor.eventos.buscarInfo(this.getID()).subscribe((data: any) => {
        if (data && data.informacao_evento && data.informacao_evento[0]) {
            this.dados.site = data.informacao_evento[0].SITE;
            this.dados.email = data.informacao_evento[0].EMAIL;
            this.dados.telefone = data.informacao_evento[0].TELEFONE;
        } else {
            this.dados.site = "";
            this.dados.email = "";
            this.dados.telefone = "";
        }
        this.salvar(this.dados);
        if (cb) cb();
    }, () => {
        this.carregar(cb);
    });*/
}

/**
 * Carrega a lista de eventos, buscando do servidor e, se falhar, buscar do armazenamento local
 * @param sucessoCb Callback executada quando uma resposta é recebida pelo servidor
 * @param localCb Callback executada quando não há resposta do servidor mas é possível carregar dados locais
 * @param falhaCb Callback executada quando não há resposta do servidor nem há nada salvo no armazenamento local
 */
/*buscarLista(sucessoCb: (listaOn: EventoInterface[]) => void, localCb: (listaLocal: EventoInterface[]) => void, falhaCb: () => void) {
    this.servidor.eventos.buscar().subscribe((data: any) => {
        //Sucesso ao contatar o servidor
        let listaServidor = this.formatarArray((data && data.eventos) ? data.eventos : []);
        this.storage.set('listaEventos', JSON.stringify(listaServidor));
        sucessoCb(listaServidor);
    }, () => {
        //Falha ao contatar o servidor
        this.storage.get('listaEventos').then((val) => {
            //Tenta buscar do armazenamento
            let listaLocal: EventoInterface[] = JSON.parse(val);
            if (listaLocal)
                localCb(listaLocal);
            else
                falhaCb(); //Não há nada no armazenamento
        }, () => {
            falhaCb(); //Falha ao carregar do armazenamento
        });
    });
}

/**
 * @param eventos Array de eventos no formato do servidor
 * @return Array formatada dos eventos para padronização dentro do app
 */
/*private formatarArray(eventos: any[]): EventoInterface[] {
    let eventosFormatados: EventoInterface[] = [];
    for (let evento of eventos)
        eventosFormatados.push(this.formatarObj(evento));

    return eventosFormatados;
}

/**
 * @param data Data em string no formato do servidor
 * @return Objeto Date convertido
 */
/*private formatarData(data: string): Date {
    return new Date(data.replace(/-/g, "/"));
}

/**
 * @param evento Evento no formato do servidor
 * @return Objeto de evento no formato do app
 */
private formatarObj(evento: any): GameGrupoInterface {
    ////--console.log("--- " + evento);
    return {
        idGrupo: evento.idGrupo,
        idEvento: evento.idEvento,
        idProprietario: evento.idProprietario,
        nome: evento.nome,
        nomeProprietario: evento.nomeProprietario,
        identificador: evento.identificador,
        descricao: evento.descricao,
        diamante: evento.diamante,
        trofeu1: evento.trofeu1,
        trofeu2: evento.trofeu2,
        trofeu3: evento.trofeu3,
        nivel: evento.nivel,
        pontos: evento.pontos,
        avaliacaoUsuarios: evento.avaliacaoUsuarios,
        imagem: evento.imagem,
        opiniao: evento.opiniao,
        questionario: evento.questionario,
        temperatura: evento.temperatura,
        sonoro: evento.sonoro,
        avaliacao: evento.avaliacao,
        completo: evento.completo,
        participantes: null,
        qtdParticipantes: evento.qtdParticipantes
    };
}

/**
 * Inscreve ou desinscreve o usuário em/de um evento
 * @param evento (opcional) Evento ao qual o usuário será inscrito
 * @param usuarioID (opcional) ID do usuário
 */
/*inscrever(evento?: EventoInterface, usuarioID?: string) {
    if (evento)
        this.servidor.eventos.atualizarParticipante(evento.ID, usuarioID);

    this.salvar(evento);
}

/**
 * Apaga os dados do evento salvo
 */
apagar() {
    this.dados = null;
    //this.comentarios = null;
    this.storage.set('game_grupo', null);
    //this.storage.set('game_comentarios_grupo', null);
}

}
