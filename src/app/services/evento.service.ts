import { Injectable } from '@angular/core';
import { ArmazenamentoService } from './armazenamento.service';
import { ServidorService } from './servidor/servidor.service';


/** Dados de um evento */
export interface EventoInterface {
    /** ID do evento */
    ID: string
    /** Nome do evento */
    nome: string
    /** Dia em que o evento começa */
    dataInicio: Date
    /** Dia em que termina o evento */
    dataFim: Date
    /** Local do evento */
    local: string
    /** Descrição do evento */
    descricao: string
    /** URL da imagem do logo do evento */
    logoURL: string
    /** Site de informações do evento */
    site: string
    /** E-mail de contato do evento */
    email: string
    /** Telefone de contato do evento */
    telefone: string
    /** Se o evento possui ou não um módulo de gamificação */
    gamificacao: number
    /** Se o evento possui ou não um módulo de album de figurinhas */
    album_figurinhas: number
    /** Se o evento é ou não online */
    is_online: number
    /** Se o evento for online, mostra o link que os participantes devem usar para acessá-lo */
    link_principal: string
}

/**
 * Armazena os dados do evento em que o usuário está inscrito
 */
@Injectable({
  providedIn: 'root',
})
export class EventoService {
    /** Dados do evento */
    private dados: EventoInterface = null;

    constructor(private storage: ArmazenamentoService, private servidor: ServidorService) { }

    getID(): string { return this.dados.ID; }
    getNome(): string { return this.dados.nome; }
    getDataInicio(): Date { return this.dados.dataInicio; }
    getDataFim(): Date { return this.dados.dataFim; }
    getLocal(): string { return this.dados.local; }
    getLogoURL(): string { return this.dados.logoURL; }
    getSite(): string { return this.dados.site; }
    getEmail(): string { return this.dados.email; }
    getTelefone(): string { return this.dados.telefone; }
    getGamificacao(): number{ return this.dados.gamificacao; }
    getIsOnline(): number{ return this.dados.is_online; }
    getLinkPrincipal(): string{ return this.dados.link_principal; }
        /*
        if(this.dados.gamificacao != undefined) {
            return this.dados.gamificacao}
            else{
                return 0;
              }*/



    /**
     * Salva os dados do evento passado no armazenamento local
     * @param evento Dados do evento
     */
    salvar(evento: EventoInterface) {
        this.storage.set('evento', JSON.stringify(evento));

    }

    /**
     * Carrega os dados do evento salvos no armazenamento local
     * @param cb Callback para ser executada quando termina de carregar
     */
    carregar(cb?: () => void) {
        this.storage.get('evento').then((val) => {
            this.dados = JSON.parse(val);
            if (this.dados) {
                //Após serem armazenadas, as datas viram strings que podem ser transformadas
                // de volta em objetos inserindo-as na construção de um novo Date
                // h deve ser do tipo any para permitir essa readequação de tipos
                let h: any = this.dados.dataInicio;
                this.dados.dataInicio = new Date(h);
                h = this.dados.dataFim;
                this.dados.dataFim = new Date(h);
            }
            if (cb) cb();
        });
    }

    /**
     * Apaga os dados do evento salvo
     */
    apagar() {
        this.dados = null;
        this.storage.set('evento', null);
        //this.gameParticipante.apagar();
       // this.gameGrupo.apagar();
    }

    /**
     * Informa se existem dados do evento
     * @returns Se existem dados do evento
     */
    existeDados(): boolean {
        return this.dados != null;
    }

    /**
     * Executa uma dada ação após garantir que os dados do evento foram carregados
     * @param cb Callback executada após garantir que os dados do evento foram carregados
     */
    disponivel(cb: () => void) {
        if (this.existeDados())
            cb();
        else
            this.carregar(cb);
    }

    /**
     * Busca as informações extras sobre o evento
     * @param cb Callback para quando termina de buscar as informações
     */
    buscarInfo(cb?: () => void) {
        this.servidor.eventos.buscarInfo(this.getID()).subscribe((data: any) => {
            if (data && data.informacao_evento && data.informacao_evento[0]) {
                this.dados.site = data.informacao_evento[0].SITE;
                this.dados.email = data.informacao_evento[0].EMAIL;
                this.dados.telefone = data.informacao_evento[0].TELEFONE;
                this.dados.gamificacao = data.informacao_evento[0].gamificacao;
            } else {
                this.dados.site = "";
                this.dados.email = "";
                this.dados.telefone = "";
                this.dados.gamificacao = 0;

            }
            this.salvar(this.dados);
            if (cb) cb();
        }, () => {
            this.carregar(cb);
        });

    }

    /**
     * Carrega a lista de eventos, buscando do servidor e, se falhar, buscar do armazenamento local
     * @param sucessoCb Callback executada quando uma resposta é recebida pelo servidor
     * @param localCb Callback executada quando não há resposta do servidor mas é possível carregar dados locais
     * @param falhaCb Callback executada quando não há resposta do servidor nem há nada salvo no armazenamento local
     */
    buscarLista(sucessoCb: (listaOn: EventoInterface[]) => void, localCb: (listaLocal: EventoInterface[]) => void, falhaCb: () => void) {
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
                if (listaLocal) {
                    for (let ev of listaLocal) {
                        let d: any = ev.dataInicio;
                        ev.dataInicio = new Date(d);
                        d = ev.dataFim;
                        ev.dataFim = new Date(d);
                    }
                    localCb(listaLocal);
                } else
                    falhaCb(); //Não há nada no armazenamento
            }, () => {
                falhaCb(); //Falha ao carregar do armazenamento
            });
        });

    }

    /**
     * @param eventos Array de eventos no formato do servidor
     * @returns Array formatada dos eventos para padronização dentro do app
     */
    private formatarArray(eventos: any[]): EventoInterface[] {
        let eventosFormatados: EventoInterface[] = [];
        for (let evento of eventos)
            eventosFormatados.push(this.formatarObj(evento));

        return eventosFormatados;
    }

    /**
     * @param data Data em string no formato do servidor
     * @returns Objeto Date convertido
     */
    private formatarData(data: string): Date {
        return new Date(data.replace(/-/g, "/"));
    }

    /**
     * @param evento Evento no formato do servidor
     * @returns Objeto de evento no formato do app
     */
    private formatarObj(evento: any): EventoInterface {
        return {
            ID: evento.ID,
            nome: evento.nome,
            dataInicio: this.formatarData(evento.Data_inicio),
            dataFim: this.formatarData(evento.Data_fim),
            local: evento.local_principal,
            descricao: evento.informacoes_gerais,
            logoURL: evento.urlLogo,
            site: "",
            email: "",
            telefone: "",
            gamificacao: evento.gamificacao,
            is_online: evento.is_online,
            album_figurinhas: evento.album_figurinhas,
            link_principal: evento.link_principal
        };
    }

    /**
     * Inscreve ou desinscreve o usuário em/de um evento
     * @param evento Evento ao qual o usuário será inscrito
     * @param usuarioID ID do usuário
     */
    inscrever(evento?: EventoInterface, usuarioID?: string, idDispositivo?: string ) {
        if (evento)
            this.servidor.eventos.atualizarParticipante(evento.ID, usuarioID,idDispositivo).subscribe(() => {});
        this.dados = evento;
        this.salvar(evento);

    }
}
