import { Injectable } from '@angular/core';
import { Observable, fromEvent, merge, of} from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ConnectivityProvider {

  public appIsOnline$: Observable<boolean>;
   /** Ações registradas para conexão */
   private callbacksConexao: {
    [ID: string]: () => void;
  };
  /** Ações registradas para desconexão */
  private callbacksDesconexao: {
    [ID: string]: () => void;
  };


  constructor() {

    this.initConnectivityMonitoring();

  }

  private initConnectivityMonitoring() {

    if (!window || !navigator || !('onLine' in navigator)) return;

    this.appIsOnline$ = merge(
      of(null),
      fromEvent(window, 'online'),
      fromEvent(window, 'offline')
    ).pipe(map(() => navigator.onLine))

  }

  /**
     * Registra uma callback a ser executada quando recuperar conexão
     * @param ID ID da callback
     * @param callback Callback a ser executada quando recuperar conexão
     */
   observarConexao(ID: string, callback: () => void) {
    this.callbacksConexao[ID] = callback;
}

  /**
     * Registra uma callback a ser executada quando perder a conexão
     * @param ID ID da callback
     * @param callback Callback a ser executada quando perder a conexão
     */
   observarDesconexao(ID: string, callback: () => void) {
    this.callbacksDesconexao[ID] = callback;
}


}
