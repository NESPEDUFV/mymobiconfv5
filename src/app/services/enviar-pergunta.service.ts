import { LinkedList } from './../utils/linked-list';
import { ServidorService } from './servidor/servidor.service';
import { ArmazenamentoService } from './armazenamento.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


/** Dados de uma pergunta */
export interface EnviarPerguntaInterface {
  /** Texto contido na pergunta */
  pergunta: string
  /** Se a pergunta já foi enviada com sucesso */
  enviada: boolean
  /** ID do evento para o qual a pergunta foi enviada */
  eventoID: string
  /** ID do usuário que enviou a pergunta */
  usuarioID: string
  /** ID da atividade para a qual a pergunta foi enviada */
  ativId: string
}


@Injectable({
  providedIn: 'root'
})
export class EnviarPerguntaService {

   /** Lista de perguntas */
   private perguntas: LinkedList<EnviarPerguntaInterface>;
   /** Permite observar quando uma pergunta é enviada */
   private envio: Subject<EnviarPerguntaInterface>
   /** @ignore */
   private _carregou: boolean = false;


  constructor(private storage: ArmazenamentoService, private servidor: ServidorService) {
    this.perguntas = new LinkedList<EnviarPerguntaInterface>();
    this.envio = new Subject<EnviarPerguntaInterface>();
  }



    /**
     * Retorna a lista de perguntas pertecentes ao dado usuário e ao dado evento
     * @param eventoID ID do evento corrente
     * @param usuarioID ID do usuário corrente
     * @param ativID ID da atividade corrente
     * @returns perguntas cujos ID's coincidem com os ID's passados
     */
     getLista(eventoID: string, usuarioID: string, ativID?: string): EnviarPerguntaInterface[] {
      if (ativID)
          return this.perguntas.filter(op => op.eventoID == eventoID && op.usuarioID == usuarioID && op.ativId == ativID);
      else
          return this.perguntas.filter(op => op.eventoID == eventoID && op.usuarioID == usuarioID && op.ativId == "NULL");
  }

  /**
   * Salva os dados das perguntas no armazenamento local
   */
  salvar() {
      this.storage.set('perguntas', JSON.stringify(this.perguntas.toArray()));
  }

  /**
   * Carrega os dados das perguntas do armazenamento local
   * @param cb Callback para quando termina de carregar
   */
  carregar(cb?: () => void) {
      this.storage.get('perguntas').then((val) => {
          let ops: EnviarPerguntaInterface[] = JSON.parse(val) || [];
          this.perguntas = new LinkedList<EnviarPerguntaInterface>(ops);
          this._carregou = true;
          if (cb) cb();
      });
  }

  /**
   * Apaga os dados das perguntas que já foram enviadas do armazenamento local
   */
  apagar() {
      let apagar: number[] = [];
      this.perguntas.forEach((item, i) => {
          if (item.enviada)
              apagar.push(i);
      });
      this.perguntas.remove(...apagar);
      this.salvar();
  }

  /**
   * Executa uma dada ação após garantir que as perguntas foram carregadas
   * @param cb Callback executada após garantir que as perguntas foram carregadas
   */
  disponivel(cb: () => void) {
      if (this._carregou)
          cb();
      else
          this.carregar(cb);
  }

   /**
     * Registra uma ação a ser feita quando uma pergunta é enviada
     * @param cb Função chamada passando as informações da pergunta enviada como parâmetro
     */
    aoEnviar(cb: (quest: EnviarPerguntaInterface) => any) {
      this.envio.subscribe(cb);
  }

  /**
   * Envia uma pergunta ao servidor
   * @param pergunta Texto da pergunta
   * @param usuarioID ID do usuário que está enviando a pergunta
   * @param eventoID ID do evento que está sendo opinado
   * @param sucessoCb Callback para quando se envia com sucesso a pergunta
   * @param falhaCb Callback para quando falha o envio
   */
  enviar(pergunta: string, usuarioID: string, eventoID: string, ativId?: string, sucessoCb?: () => void, falhaCb?: () => void) {
      let index = this.perguntas.add({
          pergunta: pergunta,
          enviada: false,
          usuarioID: usuarioID,
          eventoID: eventoID,
          ativId: ativId
      }) - 1;

      if(ativId != "0"){
          this.servidor.perguntas.enviar(pergunta, usuarioID, eventoID, ativId).subscribe(() => {
              let op = this.perguntas.get(index);
              op.enviada = true;
              this.envio.next(op);
              this.salvar();
              if (sucessoCb) sucessoCb();
          }, () => {
              this.salvar();
              if (falhaCb) falhaCb();
          });
      }else{
          this.servidor.perguntas.enviar(pergunta, usuarioID, eventoID).subscribe(() => {
              let op = this.perguntas.get(index);
              op.enviada = true;
              this.envio.next(op);
              this.salvar();
              if (sucessoCb) sucessoCb();
          }, () => {
              this.salvar();
              if (falhaCb) falhaCb();
          });
      }

  }

  /**
   * Tenta realizar os reenvios de todas as perguntas que não puderam ser enviadas
   */
  reenviar() {
      let count: number = 0;
      let trigger = () => { count--; if (count == 0) this.salvar(); }
      this.perguntas.forEach(op => {
          if (!op.enviada) {
              count++;
              this.servidor.perguntas.enviar(op.pergunta, op.usuarioID, op.eventoID, op.ativId).subscribe(() => {
                  op.enviada = true;
                  this.envio.next(op);
                  trigger();
              }, trigger);
          }
      });
  }

}
