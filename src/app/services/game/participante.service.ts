import { ServidorService } from './../servidor/servidor.service';
import { ArmazenamentoService } from './../armazenamento.service';
import { Injectable } from '@angular/core';


export interface ParticipanteInterface {
  id: number
  idEvento: number
  nome: string
  celular: string
  descricao: string
  diamante: boolean
  trofeu: number
  nivel: number
  proximoNivel: number
  pontos: number
  avaliacaoUsuarios: number
  imagem: number
  opiniao: number
  questionario: number
  temperatura: number
  sonoro: number
  avaliacao: number
  completo: number
  nomeGrupoParticipa: string
  idGrupoParticipa: number
  aceitoGrupo: boolean
}


@Injectable({
  providedIn: 'root'
})
export class GameParticipanteService {

  private dados: ParticipanteInterface;

  constructor(private storage: ArmazenamentoService, private servidor: ServidorService) { }

  //Gets e sets
  getID(): number {
    if (this.dados != null && this.dados != undefined) {
        return this.dados.id;
    } else {
        return -1;
    }

}

getIDEvento(): number {
    if (this.dados != null && this.dados != undefined) {
        return this.dados.idEvento;
    } else {
        return -1;
    }
}

getNome(): string {
    if (this.dados != null && this.dados != undefined) {
        return this.dados.nome;
    } else {
        return null;
    }

}

getCelular(): string {
    if (this.dados != null && this.dados != undefined) {
        return this.dados.celular;
    } else {
        return null;
    }

}

getDescricao(): string {
    if (this.dados != null && this.dados != undefined) {
        return this.dados.descricao;
    } else {
        return null;
    }

}


getDiamante(): boolean {
    if (this.dados != null && this.dados != undefined) {
        return this.dados.diamante;
    } else {
        return null;
    }

}

getTrofeu(): number {
    if (this.dados != null && this.dados != undefined) {
        return this.dados.trofeu;
    } else {
        return null;
    }

}

getNivel(): number {
    if (this.dados != null && this.dados != undefined) {
        return this.dados.nivel;
    } else {
        return null;
    }

}

getProximoNivel(): number {
    if (this.dados != null && this.dados != undefined) {
        return this.dados.proximoNivel;
    } else {
        return null;
    }

}

getPontos(): number {
    if (this.dados != null && this.dados != undefined) {
        return this.dados.pontos;
    } else {
        return null;
    }

}

getAvaliacaoUsuarios(): number {
    if (this.dados != null && this.dados != undefined) {
        return this.dados.avaliacaoUsuarios;
    } else {
        return null;
    }

}

getImagem(): number {
    if (this.dados != null && this.dados != undefined) {
        return this.dados.imagem;
    } else {
        return null;
    }

}

getOpiniao(): number {
    if (this.dados != null && this.dados != undefined) {
        return this.dados.opiniao;
    } else {
        return null;
    }

}

getQuestionario(): number {
    if (this.dados != null && this.dados != undefined) {
        return this.dados.questionario;
    } else {
        return null;
    }

}

getTemperatura(): number {
    if (this.dados != null && this.dados != undefined) {
        return this.dados.temperatura;
    } else {
        return null;
    }

}

getSonoro(): number {
    if (this.dados != null && this.dados != undefined) {
        return this.dados.sonoro;
    } else {
        return null;
    }

}

getAvaliacao(): number {
    if (this.dados != null && this.dados != undefined) {
        return this.dados.avaliacao;
    } else {
        return null;
    }

}

getCompleto(): number {
    if (this.dados != null && this.dados != undefined) {
        return this.dados.completo;
    } else {
        return null;
    }

}

getNomeGrupoParticipa(): string {
    if (this.dados != null && this.dados != undefined) {
        return this.dados.nomeGrupoParticipa;
    } else {
        return null;
    }

}

getIdGrupoParticipa(): number {
    if (this.dados != null && this.dados != undefined) {
        return this.dados.idGrupoParticipa;
    } else {
        return null;
    }

}

getAceitoGrupo(): boolean {
    if (this.dados != null && this.dados != undefined) {
        return this.dados.aceitoGrupo;
    } else {
        return null;
    }

}

excluirGrupo(){
    this.dados.idGrupoParticipa = null;
    this.dados.nomeGrupoParticipa = null;
}



/**
 * @return Se há dados no evento
 */
existeDados(): boolean {
    ////--console.log("Dados: " + JSON.stringify(this.dados));
    return this.dados != null;
}

/**
 * Carrega os dados do evento salvos no armazenamento local
 * @param cb (opcional) Callback para ser executada quando termina de carregar
 */
carregar(cb?: () => void) {
    this.storage.get('game_participante').then((val) => {
        ////--console.log("Carregou:" + val);
        this.dados = JSON.parse(val);
        if (cb) cb();
    }, () => {
        this.dados = null;
    });
}

/**
 * Salva os dados do evento passado no armazenamento local
 * @param evento Dados do evento
 */
salvar(okCb?: () => void) {
    //--console.log("SALVOU NO STORAGE:"+ JSON.stringify(this.dados));
    this.storage.setObservable('game_participante', JSON.stringify(this.dados)).subscribe(()=>{
        if(okCb) okCb();
    });
}

atualizarDados(okCb?: () => void, erroCb?: () => void){
    //--console.log("ATUALIZANDO...");
    this.cadastrarParticipante(this.getID(),this.getIDEvento(),()=>{if(okCb) okCb()},()=>{if(erroCb)erroCb()});
}

cadastrarParticipante(idParticipante: any, idEvento: any, okCb: () => void, erroCb: (mensagem:string) => void) {
  console.log('cadastrar');
    this.servidor.game_participante.criarPerfil(idParticipante, idEvento).subscribe((val: any) => {
        if (val['success'] == 1 || val['success'] == 2) {
            val.usuario.diamante = val.usuario.diamante;
            this.dados = val.usuario;
            this.salvar(()=>{
                okCb();
            });

        } else {
            this.dados = null;
            this.salvar();
            erroCb(val['message']);
        }

    }, () => {
        erroCb("Erro ao conectar ao servidor");

    });
}

existePerfil(idParticipante: any, idEvento: any, okCb: () => void, erroCb: () => void) {
    this.servidor.game_participante.existePerfil(idParticipante, idEvento).subscribe((val: any) => {
        if (val['success'] == 1 && val.existe) {
            okCb();
        } else {
            erroCb();
        }

    }, () => {


    });
}

editarPerfil(nome: string, celular: string, descricao: string, imagem: number, okCb: () => void, erroCb: () => void, erroConexaoCb: () => void) {
    this.servidor.game_participante.editarUsuario(this.getID(), this.getIDEvento(), nome, celular, descricao, imagem).subscribe((val: any) => {
        if (val['success']) {
            this.dados.nome = nome;
            this.dados.celular = celular;
            this.dados.descricao = descricao;
            this.dados.imagem = imagem;
            this.salvar();
            ////--console.log("Sucesso!!!!!!!!!");
            okCb();
        } else {
            erroCb();
        }

    }, () => {
        erroCb();
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


visualizarParticipante(idParticipante: any, idEvento: any, okCb: (participante:ParticipanteInterface) => void, erroCb: () => void) {
    this.servidor.game_participante.visualizarPerfil(idParticipante, idEvento).subscribe((val: any) => {
        ////--console.log("Visualizar:>"+val);
        if (val['success'] == 1) {
            //val.usuario.diamante = val.usuario.diamante == 0 ? false : true;
            okCb(this.formatarObj(val.usuario));
        } else {

            erroCb();
        }

    }, () => {


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
private formatarObj(evento: any): ParticipanteInterface {
    ////--console.log("--- " + evento);
    return {
        id: evento.id,
        idEvento: evento.idEvento,
        nome: evento.nome,
        celular: evento.celular,
        descricao: evento.descricao,
        diamante: evento.diamante,
        trofeu: evento.trofeu,
        nivel: evento.nivel,
        proximoNivel: evento.proximoNivel,
        pontos: evento.pontos,
        avaliacaoUsuarios: evento.avaliacaoUsuarios,
        imagem: evento.imagem,
        opiniao: evento.opiniao,
        questionario: evento.questionario,
        temperatura: evento.temperatura,
        sonoro: evento.sonoro,
        avaliacao: evento.avaliacao,
        completo: evento.completo,
        nomeGrupoParticipa: evento.nomeGrupoParticipa,
        idGrupoParticipa: evento.idGrupoParticipa,
        aceitoGrupo: evento.aceitoGrupo
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
    this.storage.set('game_participante', null);
}
}
