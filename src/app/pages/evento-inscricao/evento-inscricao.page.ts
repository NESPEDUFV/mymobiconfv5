import { UsuarioService } from './../../services/usuario.service';
import { EventoService, EventoInterface } from 'src/app/services/evento.service';
import { DatasUtil } from './../../utils/datas';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-evento-inscricao',
  templateUrl: './evento-inscricao.page.html',
  styleUrls: ['./evento-inscricao.page.scss'],
})
export class EventoInscricaoPage implements OnInit {

  /** Evento cujas informações serão exibidas */
  eventoEscolhido: EventoInterface;
  /** Versões formatadas das datas de início e fim do evento */
  data = { inicio: "-", fim: "-" };
  /** Se o usuário vai se desinscrever caso aperte o botão da página */
  desinscrever: boolean;
  /** Verifica a se o evento possui gamificação */
  gamificacao: number = 0;


   /**
     * @param router Usado para voltar à página principal
     * @param navParams Usado para adquirir os dados passados como parâmetro a esta página
     * @param toastCtrl
     * @param evento
     * @param usuario Usado para adquirir o ID do usuário
     * @param atividades Usado para apagar os dados anteriores das atividades
     * @param parceiros Usado para apagar os dados anteriores dos parceiros
     * @param noticias Usado para apagar os dados anteriores das notícias
     * @param notif Usado para apagar os dados anteriores das notificações
     */

  constructor(

    private toastCtrl: ToastController,
    private evento: EventoService,
    private usuario: UsuarioService,
    private router: Router
  ) { }

  inscrever(){
    console.log("inscrever\n");
  }


  ngOnInit() {
  }


}
