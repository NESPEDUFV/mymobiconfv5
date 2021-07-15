import { DatasUtil } from './../../utils/datas';
import { EventoService } from 'src/app/services/evento.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-evento-info',
  templateUrl: './evento-info.page.html',
  styleUrls: ['./evento-info.page.scss'],
})
export class EventoInfoPage implements OnInit {

  /** Nome do evento */
  nome: string = "-";
  /** URL da logo do evento */
  logoURL: string = "";

  /** Versão formatada da data do início do evento */
  dataInicio: string = "-";
  /** Versão formatada da data do fim do evento */
  dataFim: string = "-";
  /** Local do evento */
  local: string = "";

  /** Site referente ao evento */
  site: string = "";
  /** E-mail de contato */
  email: string = "";
  /** Telefone de contato */
  telefone: string = "";
  /** Verifica a se o evento possui gamificação */
  gamificacao: number = 0;
  /** Se o evento é ou não online */
  is_online: number = 0;
  /** Se o evento for online, mostra o link que os participantes devem usar para acessá-lo */
  link_principal: string = "";

  /**
   * @param evento Usado para adquirir os dados
   */

  constructor(private evento: EventoService) { }

  /**
     * Ao entrar na página, carrega os dados a serem exibidos
     */
   ionViewWillEnter() {
    this.evento.buscarInfo(() => {
        this.site = this.evento.getSite();
        this.email = this.evento.getEmail();
        this.telefone = this.evento.getTelefone();
    });
    this.nome = this.evento.getNome();
    this.logoURL = this.evento.getLogoURL();
    this.dataInicio = DatasUtil.completa(this.evento.getDataInicio());
    this.dataFim = DatasUtil.completa(this.evento.getDataFim());
    this.local = this.evento.getLocal();
    this.gamificacao = this.evento.getGamificacao();
    this.is_online = this.evento.getIsOnline();
    this.link_principal = this.evento.getLinkPrincipal();
}
  ngOnInit() {
  }

}
