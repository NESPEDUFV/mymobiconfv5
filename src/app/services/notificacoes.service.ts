import { ConfigService, Config } from './config.service';
import { DatasUtil } from './../utils/datas';
import { ArmazenamentoService } from './armazenamento.service';
import { Injectable } from '@angular/core';
/** @ignore */
declare var cordova: any;

/** Dados de uma notificação */
export interface NotifInterface {
  /** ID da notificação (coincide com o ID da atividade a que se relaciona) */
  ID: string
  /** Nome da atividade */
  nome: string
  /** Hora de início da atividade */
  horaInicio: Date
  /** Hora de fim da atividade */
  horaFim: Date
}


@Injectable({
  providedIn: 'root'
})
export class NotificacoesService {
 /** Armazena notificações que ainda não foram emitidas. Caso o usuário saia do aplicativo por muito tempo, alguma notificação pode se perder, então esse armazenamento é usado para reemitir essas notificações */
 private notifPendendtes: { [ID: string]: NotifInterface } = {};
 /** @ignore */
 private _carregou: boolean = false;

 constructor(private storage: ArmazenamentoService, private config: ConfigService) { }

 /**
  * Salva as notificações pendentes
  */
 salvar() {
     this.storage.set('notif', JSON.stringify(this.notifPendendtes));
 }

 /**
  * Carrega as notificações pendentes
  * @param cb Callback para ser executada quando termina de carregar
  */
 carregar(cb?: () => void) {
     this.storage.get('notif').then((val) => {
         this.notifPendendtes = JSON.parse(val) || {};
         let h: any;
         for (let i in this.notifPendendtes) {
             h = this.notifPendendtes[i].horaInicio;
             this.notifPendendtes[i].horaInicio = new Date(h);
             h = this.notifPendendtes[i].horaFim;
             this.notifPendendtes[i].horaFim = new Date(h);
         }
         this._carregou = true;
         if (cb) cb();
     });
 }

 /**
  * Apaga todas as notificações e as pendentes
  */
 apagar() {
     this.notifPendendtes = {};
     cordova.plugins.notification.local.clearAll();
     this.storage.remove('notif');
 }

 /**
  * Executa uma dada ação após garantir que as notificações foram carregadas
  * @param cb Callback executada após garantir que as notificações foram carregados
  */
 disponivel(cb: () => void) {
     if (this._carregou)
         cb();
     else
         this.carregar(cb);
 }

 /**
  * Ao agendar uma atividade, registra uma notificação
  * @param id ID da atividade
  * @param nome Nome da atividade
  * @param horaInicio Hora de início da atividade
  * @param horaFim Hora da fim da atividade
  * @param reemitindo Se está apenas reemitindo a notificação
  */
 aoAgendar(id: string, nome: string, horaInicio: Date, horaFim: Date, reemitindo?: boolean) {
     if (!this.config.get(Config.AtivarNotif)) return;
     let hi: number = horaInicio.getTime();
     let tempo: number = hi - DatasUtil.MargemErroTempo;
     let agora: number = Date.now();
     if (agora < horaFim.getTime()) {
         if (!reemitindo)
             this.notifPendendtes[id] = { ID: id, nome: nome, horaInicio: horaInicio, horaFim: horaFim }
         if (agora > tempo)
             tempo = agora + 1000;
             /////
         cordova.plugins.notification.local.schedule({
             id: id,
             title: nome,
             text: "Sua atividade agendada, \"" + nome + ((agora > hi) ? "\", já começou!" : "\", está prestes a começar!")
                 + "\nHorário: " + DatasUtil.hora(horaInicio) + " - " + DatasUtil.hora(horaFim),
             at: new Date(tempo),
             foreground: true,
             icon: 'res://icon.png',
             smallIcon: 'res://notif.png'
         });
     }
 }

 /**
  * Registra uma ação de quando uma notificação for clicada
  * @param cb Callback do que será executado (recebe o ID da atividade como parâmetro)
  */
 aoClicar(cb: (ativID: string) => void) {

     /////
     cordova.plugins.notification.local.on('click', (notif) => {
         delete this.notifPendendtes[notif.id];
         cb(notif.id);
     });
 }

 /**
  * Ao tirar da agenda uma atividade, limpa a notificação relacionada
  * @param ativID Atividade tirada da agenda
  */
 aoTirarDaAgenda(ativID: string) {
     delete this.notifPendendtes[ativID];
     cordova.plugins.notification.local.clear(ativID);
 }

 /**
  * Reemite qualquer notificação pendente, descartando as que já passaram da hora
  */
 reemitir() {
     let agora: number = Date.now();
     for (let id in this.notifPendendtes) {
         let notif = this.notifPendendtes[id];
         if (agora > notif.horaFim.getTime())
             delete this.notifPendendtes[id];
         else
             this.aoAgendar(id, notif.nome, notif.horaInicio, notif.horaFim, true);
     }
 }
}
