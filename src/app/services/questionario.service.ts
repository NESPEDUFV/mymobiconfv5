import { LinkedList } from './../utils/linked-list';
import { ServidorService } from './servidor/servidor.service';
import { ArmazenamentoService } from './armazenamento.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/** Dados de uma resposta de questionário */
interface RespostaInterface {
  /** ID da resposta */
  ID: string
  /** Texto da resposta */
  resposta: string
}

/** Dados de uma pergunta de questionário */
export interface PerguntaInterface {
  /** ID da pergunta */
  ID: string
  /** Texto da pergunta */
  pergunta: string
  /** Lista de possíveis respostas à pergunta */
  respostas: RespostaInterface[]
}

/** Dados de um questionário */
export interface QuestionarioInterface {
  /** ID do quesitonário */
  ID: string
  /** ID da atividade à qual o questionário está relacionado */
  ativID: string
  /** Título do questionário */
  titulo: string
  /** Título da atividade  */
  ativTitulo: string
  /** Lista de perguntas do questionário */
  perguntas: PerguntaInterface[]
}

/** Versão formulário de um questionário, associando os ID's das perguntas aos ID's das respostas */
interface QuestFormInterface {
  [questID: string]: {
      enviado: boolean
      respostaIDs: { [perguntaID: string]: string }
  }
}

/** Dados para reenvio de formulários pendentes */
interface QuestEnvioInterface {
  /** ID do questionário */
  questID: string
  /** Lista de ID's das respostas escolhidas para cada pergunta */
  respostaIDs: string[]
  /** Lista dos ID's das perguntas */
  perguntaIDs: string[]
  /** ID do evento do questionário */
  eventoID: string
  /** ID do usuário que respondeu o questionário */
  usuarioID: string
}


@Injectable({
  providedIn: 'root'
})
export class QuestionarioService {
  /** Lista de questionários */
  private questionarios: QuestionarioInterface[];
  /** Respostas marcadas para os questionários */
  private questsRespondidos: QuestFormInterface;
  /** Questionários cujo envio está pendente */
  private questsParaEnviar: LinkedList<QuestEnvioInterface>;
  /** Permite observar o envio de questionários */
  private envio: Subject<QuestEnvioInterface>;
  /** @ignore */
  private _carregou: boolean = false;

  constructor(private servidor: ServidorService, private storage: ArmazenamentoService) {
      this.questionarios = [];
      this.questsRespondidos = {};
      this.questsParaEnviar = new LinkedList<QuestEnvioInterface>();
      this.envio = new Subject<QuestEnvioInterface>();
  }

  /**
     * Retorna a lista dos questionários carregada do servidor
     * @returns Lista dos questionários carregada depois de buscar do servidors
     */
    getLista(): QuestionarioInterface[] { return this.questionarios; }

    /**
     * Salva os questionários já respondidos, também para enviar mais tarde os que não puderam ser enviados
     */
    salvar() {
        this.storage.set('questsResp', JSON.stringify(this.questsRespondidos));
        this.storage.set('questsEnviar', JSON.stringify(this.questsParaEnviar.toArray()));
    }

    /**
     * Carrega os questionários respondidos e os que devem ser enviados depois
     * @param cb Callback para quando termina de carregar
     */
    carregar(cb?: () => void) {
        let count = 2;
        let trigger = () => {
            count--;
            if (cb && count == 0) {
                cb();
                this._carregou = true;
            }
        };
        this.storage.get('questsResp').then((val) => {
            this.questsRespondidos = JSON.parse(val) || {};
            trigger();
        });
        this.storage.get('questsEnviar').then((val) => {
            let pEnviar = JSON.parse(val) || [];
            this.questsParaEnviar = new LinkedList<QuestEnvioInterface>(pEnviar);
            trigger();
        });
    }

    /**
     * Apaga os questionários respondidos
     */
    apagar() {
        this.questsRespondidos = {};
        this.salvar();
    }

    /**
     * Executa uma dada ação após garantir que os questionários foram carregados
     * @param cb Callback executada após garantir que os questionários foram carregados
     */
    disponivel(cb: () => void) {
        if (this._carregou)
            cb();
        else
            this.carregar(cb);
    }

    /**
     * Registra uma ação a ser feita quando um questionário é enviado
     * @param cb Função chamada passando as informações do quetionário enviado como parâmetro
     */
    aoEnviar(cb: (quest: QuestEnvioInterface) => any) {
        this.envio.subscribe(cb);
    }

    /**
     * Envia respostas de um questionário
     * @param questID ID do questionário a ser respondido
     * @param usuarioID ID do usuário que está respondendo
     * @param eventoID ID do evento
     * @param sucessoCb Callback para quando consegue enviar
     * @param falhaCb Callback para quando há falha no envio
     */
    enviar(questID: string, usuarioID: string, eventoID: string, sucessoCb?: () => void, falhaCb?: () => void) {
        let quest = this.questsRespondidos[questID];
        let perguntaIDs: string[] = [];
        let respostaIDs: string[] = [];
        quest.enviado = false;
        //Monta simultaneamente as arrays de ID's das perguntas e das respostas
        //Deve ser simultâneo para garantir que os índices nos arrays se alinhem
        for (let p in quest.respostaIDs) {
            perguntaIDs.push(p);
            respostaIDs.push(quest.respostaIDs[p]);
        }

        let questEnvio: QuestEnvioInterface = {
            questID: questID,
            respostaIDs: respostaIDs,
            perguntaIDs: perguntaIDs,
            usuarioID: usuarioID,
            eventoID: eventoID
        };
        this.servidor.questionarios.enviarResposta(perguntaIDs, respostaIDs, usuarioID, eventoID).subscribe(() => {
            quest.enviado = true;
            this.envio.next(questEnvio);
            this.salvar();
            if (sucessoCb) sucessoCb();
        }, () => {
            //Marca o questionário para ser enviado mais tarde
            this.questsParaEnviar.add(questEnvio);
            this.salvar();
            if (falhaCb) falhaCb();
        });
    }

    /**
     * Busca os questionários do servidor
     * @param eventoID ID do evento cujos questionários serão buscados
     * @param usuarioID ID do usuário
     * @param sucessoCb Callback chamada após carregar a lista
     * @param falhaCb Callback chamada quando não se consegue carregar a lista
     */
    buscar(eventoID: string, usuarioID: string, sucessoCb: () => void, falhaCb: () => void) {
        this.servidor.questionarios.buscar(eventoID, usuarioID).subscribe((data: any) => {
            this.questionarios = this.formatarArray(data.questionarios || []);
            sucessoCb();
        }, () => {
            falhaCb();
        });
    }

    /**
     * @param quest Questionário no formato do servidor
     * @returns Questionário no formato do app
     */
    private formatarObj(quest): QuestionarioInterface {
        let perguntas: PerguntaInterface[] = [];
        for (let p of quest.perguntas) {
            let respostas: RespostaInterface[] = [];
            for (let r of p.respostas)
                respostas.push({ ID: r.ID, resposta: r.resposta });
            perguntas.push({ ID: p.ID, pergunta: p.pergunta, respostas: respostas });
        }
        return {
            ID: quest.ID,
            ativID: quest.ID_ATIVIDADE,
            titulo: quest.nome,
            ativTitulo: quest.atividadeNome,
            perguntas: perguntas
        };
    }

    /**
     * @param quests Lista de questionários no formato do servidor
     * @returns Lista de questionários no formato do app
     */
    private formatarArray(quests): QuestionarioInterface[] {
        let listaQ: QuestionarioInterface[] = [];
        for (let q of quests)
            listaQ.push(this.formatarObj(q));
        return listaQ;
    }

    /**
     * Retorna as respostas dadas às perguntas de um questionário
     * @param questID ID do questionário
     * @returns Mapa dos IDs de respostas associados a cada ID de pergunta de um questionário
     */
    getRespostas(questID: string): { [perguntaID: string]: string } {
        let quest = this.questsRespondidos[questID];
        if (quest)
            return quest.respostaIDs;
        else
            return {};
    }

    /**
     * Verifica se um dado questionário foi enviado
     * @param questID ID do questionário
     * @returns Se o questionário foi enviado
     */
    foiEnviado(questID: string): boolean {
        let quest = this.questsRespondidos[questID];
        if (quest)
            return quest.enviado;
        else
            return false;
    }

    /**
     * Calcula quantas perguntas já foram respondidas de um questionário
     * @param questID ID do questionário
     * @returns Quantidade de perguntas respondidas do dado questionário
     */
    getQtRespondidas(questID: string): number {
        let quest = this.questsRespondidos[questID];
        if (quest)
            return Object.keys(quest.respostaIDs).length;
        else
            return 0;
    }

    /**
     * Reenvia os questionários ainda não enviados
     */
    reenviar() {
        let apagar: number[] = [];
        let count = 0;
        let trigger = () => {
            count--;
            if (count == 0) {
                this.questsParaEnviar.remove(...apagar);
                this.salvar();
            }
        }
        this.questsParaEnviar.forEach((q, i) => {
            count++;
            this.servidor.questionarios.enviarResposta(q.perguntaIDs, q.respostaIDs, q.usuarioID, q.eventoID).subscribe(() => {
                this.questsRespondidos[q.questID].enviado = true;
                this.envio.next(q);
                apagar.push(i);
                trigger();
            }, trigger);
        });
    }

    /**
     * Marca uma resposta de alguma pergunta de um questionário
     * @param questID ID do questionário sendo respondido
     * @param perguntaID ID da pergunta sendo respondida
     * @param respostaID ID da resposta escolhida
     */
    responder(questID: string, perguntaID: string, respostaID: string) {
        if (!this.questsRespondidos[questID])
            this.questsRespondidos[questID] = {
                enviado: false,
                respostaIDs: {}
            };

        this.questsRespondidos[questID].respostaIDs[perguntaID] = respostaID;
        this.questsRespondidos[questID].enviado = false;
        this.salvar();
    }
}
