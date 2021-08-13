import { LinkedList } from './../utils/linked-list';
import { ServidorService } from './servidor/servidor.service';
import { ArmazenamentoService } from './armazenamento.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/** Dados de um voto */
export interface VotosInterface {
  /** vendo se foi curtida */
  enviada: number
  /** ID da pergunta */
  pergID: string
  /** ID do usuário */
  usuarioID: string
}

/**
* Realiza o envio e reenvio de votos e guarda histórico local de votos
*/

@Injectable({
  providedIn: 'root'
})
export class VotosService {
 /** Lista de votos */
 private votos: LinkedList<VotosInterface>;
 /** Permite observar quando um voto é enviada */
 private envio: Subject<VotosInterface>
 /** @ignore */
 private _carregou: boolean = false;

 constructor(private storage: ArmazenamentoService, private servidor: ServidorService) {
     this.votos = new LinkedList<VotosInterface>();
     this.envio = new Subject<VotosInterface>();
 }

 /**
  * Retorna a lista de votos pertecentes ao dado usuário e ao dado evento
  * @param eventoID ID do evento corrente
  * @param usuarioID ID do usuário corrente
  * @returns votos cujos ID's coincidem com os ID's passados
  */
 getLista(pergID: string, usuarioID: string): VotosInterface[] {
     return this.votos.filter(op => op.pergID == pergID && op.usuarioID == usuarioID);
 }

 /**
  * Salva os dados das votos no armazenamento local
  */
 salvar() {
     this.storage.set('votos', JSON.stringify(this.votos.toArray()));
 }

 /**
  * Carrega os dados das votos do armazenamento local
  * @param cb Callback para quando termina de carregar
  */
 carregar(cb?: () => void) {
     this.storage.get('votos').then((val) => {
         let ops: VotosInterface[] = JSON.parse(val) || [];
         this.votos = new LinkedList<VotosInterface>(ops);
         this._carregou = true;
         if (cb) cb();
     });
 }

 /**
  * Apaga os dados das votos que já foram enviadas do armazenamento local
  */
 apagar() {
     let apagar: number[] = [];
     this.votos.forEach((item, i) => {
         if (item.enviada)
             apagar.push(i);
     });
     this.votos.remove(...apagar);
     this.salvar();
 }

 /**
  * Executa uma dada ação após garantir que as votos foram carregadas
  * @param cb Callback executada após garantir que as votos foram carregadas
  */
 disponivel(cb: () => void) {
     if (this._carregou)
         cb();
     else
         this.carregar(cb);
 }

 /**
  * Registra uma ação a ser feita quando uma voto é enviada
  * @param cb Função chamada passando as informações da voto enviada como parâmetro
  */
 aoEnviar(cb: (quest: VotosInterface) => any) {
     this.envio.subscribe(cb);
 }

 /**
  * Envia um voto para o servidor
  * @param pergID id da pergunta
  * @param usuarioID ID do usuário que está enviando o voto
  * @param sucessoCb Callback para quando se envia com sucesso o voto
  * @param falhaCb Callback para quando falha o envio
  */
 enviarVoto(pergID: string, usuarioID: string, sucessoCb?: () => void, falhaCb?: () => void) {
     let index = this.votos.add({
         enviada: 1,
         usuarioID: usuarioID,
         pergID: pergID
     }) - 1;

     this.servidor.votos.enviarVoto(pergID,usuarioID).subscribe(() => {
         let op = this.votos.get(index);
         this.envio.next(op);
         this.salvar();
         if (sucessoCb) sucessoCb();
     }, () => {
         this.salvar();
         if (falhaCb) falhaCb();

     });
 }
}
