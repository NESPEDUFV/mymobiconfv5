import { LinkedList } from './../utils/linked-list';
import { ServidorService } from './servidor/servidor.service';
import { ArmazenamentoService } from './armazenamento.service';
import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

export interface OpiniaoInterface {
  /** Texto contido na opinião */
  texto: string
  /** Hora em que a opinião foi enviada */
  horaEnvio: Date
  /** Se a opinião já foi enviada com sucesso */
  enviada: boolean
  /** ID do evento para o qual a opinião foi enviada */
  eventoID: string
  /** ID do usuário que enviou a opinião */
  usuarioID: string
  /** Se é anônimo */
  anonimo:boolean
}

@Injectable({
  providedIn: 'root'
})


export class OpnioesService {

 /** Lista de opiniões */
 private opinioes: LinkedList<OpiniaoInterface>;
 /** Permite observar quando uma opinião é enviada */
 private envio: Subject<OpiniaoInterface>
 /** @ignore */
 private _carregou: boolean = false;

 constructor(private storage: ArmazenamentoService, private servidor: ServidorService) {
     this.opinioes = new LinkedList<OpiniaoInterface>();
     this.envio = new Subject<OpiniaoInterface>();
 }

    /**
     * Retorna a lista de opiniões pertecentes ao dado usuário e ao dado evento
     * @param eventoID ID do evento corrente
     * @param usuarioID ID do usuário corrente
     * @returns Opiniões cujos ID's coincidem com os ID's passados
     */
     getLista(eventoID: string, usuarioID: string): OpiniaoInterface[] {
      return this.opinioes.filter(op => op.eventoID == eventoID && op.usuarioID == usuarioID);
  }

    /**
     * Salva os dados das opiniões no armazenamento local
     */
     salvar() {
      this.storage.set('opinioes', JSON.stringify(this.opinioes.toArray()));
  }

  /**
   * Carrega os dados das opiniões do armazenamento local
   * @param cb Callback para quando termina de carregar
   */
  carregar(cb?: () => void) {
      this.storage.get('opinioes').then((val) => {
          let ops: OpiniaoInterface[] = JSON.parse(val) || [];
          for (let op of ops) {
              let h: any = op.horaEnvio; // Transformar data: string -> Date
              op.horaEnvio = new Date(h);
          }
          this.opinioes = new LinkedList<OpiniaoInterface>(ops);
          this._carregou = true;
          if (cb) cb();
      });
  }

   /**
     * Apaga os dados das opiniões que já foram enviadas do armazenamento local
     */
    apagar() {
      let apagar: number[] = [];
      this.opinioes.forEach((item, i) => {
          if (item.enviada)
              apagar.push(i);
      });
      this.opinioes.remove(...apagar);
      this.salvar();
  }

  /**
   * Executa uma dada ação após garantir que as opiniões foram carregadas
   * @param cb Callback executada após garantir que as opiniões foram carregadas
   */
  disponivel(cb: () => void) {
      if (this._carregou)
          cb();
      else
          this.carregar(cb);
  }

    /**
     * Registra uma ação a ser feita quando uma opinião é enviada
     * @param cb Função chamada passando as informações da opinião enviada como parâmetro
     */
     aoEnviar(cb: (quest: OpiniaoInterface) => any) {
      this.envio.subscribe(cb);
  }

  /**
   * Envia uma opinião ao servidor
   * @param opiniao Texto da opinião
   * @param usuarioID ID do usuário que está enviando a opinião
   * @param eventoID ID do evento que está sendo opinado
   * @param sucessoCb Callback para quando se envia com sucesso a opinião
   * @param falhaCb Callback para quando falha o envio
   */
  enviar(opiniao: string, usuarioID: string, eventoID: string, anonimo:boolean, sucessoCb?: () => void, falhaCb?: () => void) {
      let index = this.opinioes.add({
          texto: opiniao,
          horaEnvio: new Date(),
          enviada: false,
          usuarioID: usuarioID,
          eventoID: eventoID,
          anonimo: anonimo
      }) - 1;

      this.servidor.opinioes.enviar(opiniao, usuarioID, eventoID, anonimo).subscribe(() => {
          let op = this.opinioes.get(index);
          op.enviada = true;
          this.envio.next(op);
          this.salvar();
          if (sucessoCb) sucessoCb();
      }, () => {
          this.salvar();
          if (falhaCb) falhaCb();
      });
  }

  /**
   * Tenta realizar os reenvios de todas as opiniões que não puderam ser enviadas
   */
  reenviar() {
      let count: number = 0;
      let trigger = () => { count--; if (count == 0) this.salvar(); }
      this.opinioes.forEach(op => {
          if (!op.enviada) {
              count++;
              this.servidor.opinioes.enviar(op.texto, op.usuarioID, op.eventoID, op.anonimo).subscribe(() => {
                  op.enviada = true;
                  this.envio.next(op);
                  trigger();
              }, trigger);
          }
      });
  }


}
