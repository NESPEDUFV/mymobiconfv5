import { PassosMsgs, PassosTutorial } from './../component/tutorial/passos/passos.component';
import { ArmazenamentoService } from './armazenamento.service';
import { Injectable } from '@angular/core';


export enum Config {
  AtivarNotif, PermitirConflito
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  /** Valores padrão para as configurações gerais */
  private static readonly defaultConfigs: boolean[] = [true, false];
  /** Configurações gerais */
  private configs: boolean[];
  /** Lista das partes do tutorial, marcando se foram vistas */
  private tutorial: boolean[];
  /** @ignore */
  private _carregou: boolean = false;

  constructor(private storage: ArmazenamentoService) {

    this.configs = ConfigService.defaultConfigs;
    this.tutorial = [];
    for (let i = 0; i < PassosMsgs.length; i++)
        this.tutorial[i] = false;

  }


   /**
     * Salva as configurações no armazenamento
     */
    salvar() {
      this.storage.set('configs', JSON.stringify(this.configs));
      this.storage.set('tutorial', JSON.stringify(this.tutorial));
  }

  /**
   * Carrega as configurações do armazenamento
   * @param cb Callback para ser executada quando termina de carregar
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
      this.storage.get('configs').then(val => {
          this.configs = JSON.parse(val) || ConfigService.defaultConfigs;
          trigger();
      });
      this.storage.get('tutorial').then(val => {
          this.tutorial = JSON.parse(val);
          if (!this.tutorial) this.tutorialReset();
          trigger();
      });
  }

  /**
   * Apaga as configurações do armazenamento
   */
  apagar() {
      this.configs = ConfigService.defaultConfigs;
      this.storage.remove('configs');
  }

  /**
   * Executa uma dada ação após garantir que as configurações foram carregadas
   * @param cb Callback executada após garantir que as configurações foram carregadas
   */
  disponivel(cb: () => void) {
      if (this._carregou)
          cb();
      else
          this.carregar(cb);
  }

  /**
   * @param c Configuração a ser adquirida
   * @returns Valor da configuração
   */
  get(c: Config): boolean {
      return this.configs[c];
  }

  /**
   * Muda o valor de um configuração
   * @param c Configuração a ser alterada
   * @param val Novo valor da configuração
   */
  set(c: Config, val: boolean) {
      this.configs[c] = val;
      this.salvar();
  }

  /**
   * @param i Índice de uma parte do tutorial
   * @returns Se uma determinada parte do tutorial foi vista
   */
  tutorialFoiVisto(i: PassosTutorial): boolean {
      return this.tutorial[i];
  }

  /**
   * Marca um passo do tutorial como visto
   * @param i Índice de uma parte do tutorial
   */
  tutorialMarcarVisto(i: PassosTutorial) {
      this.tutorial[i] = true;
      this.salvar();
  }

  /**
   * Volta o tutorial para o estado em que nenhum passo foi visto
   */
  tutorialReset() {
      this.tutorial = [];
      for (let i = 0; i < PassosMsgs.length; i++)
          this.tutorial[i] = false;
      this.salvar();
  }
}
