import { NotasService } from './../../services/notas.service';
import { NotificacoesService } from './../../services/notificacoes.service';
import { OpnioesService } from './../../services/opnioes.service';
import { AtividadesService } from './../../services/atividades.service';
import { EventoService } from './../../services/evento.service';
import { UsuarioService } from './../../services/usuario.service';
import { OverlayService } from './../../services/overlay.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { QuestionarioService } from 'src/app/services/questionario.service';
import { ParceirosService } from 'src/app/services/parceiros.service';
import { NoticiaService } from 'src/app/services/noticia.service';
import { Config, ConfigService } from 'src/app/services/config.service';




@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
})
export class ConfigPage implements OnInit {

    //Disponibilizar enums para o HTML
    /** @ignore */
    cfg = Config;

    /** Configuração de permitir notificações */
    notif: boolean;
    /** Configuração do conflito de atividades agendadas */
    conflito: boolean;

    /**
     * @param navCtrl Usado para sair da página
     * @param config
     * @param overlay
     * @param usuario Usado para apagar os dados do usuário
     * @param evento Usado para apagar os dados do evento
     * @param atividades Usado para apagar os dados das atividades
     * @param notas Usado para apagar os dados das notas
     * @param questionarios Usado para apagar os dados dos questionários
     * @param opinioes Usado para apagar os dados das opiniões
     * @param parceiros Usado para apagar os dados dos parceiros
     * @param notificacoes Usado para apagar os dados das notificações
     * @param noticias Usado para apagar os dados das notícias
     */

  constructor(
    private config: ConfigService,
    private router: Router,
    private overlay: OverlayService,
    private usuario: UsuarioService,
    private evento: EventoService,
    private atividades: AtividadesService,
    private notas:NotasService,
    private questionarios: QuestionarioService,
    private opinioes: OpnioesService,
    private parceiros: ParceirosService,
    private notificacoes: NotificacoesService,
    private noticias: NoticiaService,
  ) { }

  /**
     * Ao entrar na página, carrega as configurações correntes
     */
  ngOnInit() {
    this.notif = this.config.get(Config.AtivarNotif);
    this.conflito = this.config.get(Config.PermitirConflito);
  }



  /**
   * Muda uma configuração. Se essa configuração for a de ativar/desativar as notificações, também emite/cancela todas as notificações necessárias, respectivamente
   * @param c Configuração a ser alterada
   * @param val Novo valor da configuração
   */
  mudarConfig(c: Config, val: boolean) {
      this.config.set(c, val);
      if (c == Config.AtivarNotif)
          if (val)
              this.atividades.listarAgendadas().forEach(ativ =>
                  this.notificacoes.aoAgendar(ativ.ID, ativ.titulo, ativ.horaInicio, ativ.horaFim)
              );
          else
              this.notificacoes.apagar();
  }

  /**
   * Ativa novamente os tutoriais
   */
  ativarTutoriais() {
      this.config.tutorialReset();
      this.overlay.createAlert(
        "Tutorial reativado!",
        "Todos os tutoriais serão reexibidos quando você visitar as respectivas áreas do aplicativo.",
        'OK'
      );
  }

  /**
   * Sai da conta do usuário
   */
  logout() {
      this.overlay.presentAlertConfirm(
         "Atenção",
          "Deseja mesmo fazer logout? Seus dados dentro do aplicativo serão perdidos.",
          "Sim",
          () => {
            this.atividades.apagar();
            this.evento.apagar();
            this.notas.apagar();
            this.noticias.apagar();
            this.notificacoes.apagar();
            this.opinioes.apagar();
            this.parceiros.apagar();
            this.questionarios.apagar();
            this.usuario.logout();
           // this.navCtrl.pop();
          }
    )
  }

}
