import { OpcoesEnviarPerguntasPage } from './../opcoes-enviar-perguntas/opcoes-enviar-perguntas.page';
import { SalasOffTopicPage } from './../salas-off-topic/salas-off-topic.page';
import { EventoService, EventoInterface } from 'src/app/services/evento.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-social',
  templateUrl: './social.page.html',
  styleUrls: ['./social.page.scss'],
})
export class SocialPage implements OnInit {
  botoes: { id: string, label: string, pagina: any }[] = [
    { id: "questionarios", label: "Envio de perguntas", pagina: OpcoesEnviarPerguntasPage },
    { id: "opinar", label: "Salas Off-Topic", pagina: SalasOffTopicPage }
  ];

  is_online : number
  /**
 * @param router Usado para mudança de páginas
 * @param evento Usado para adquirir o ID do evento
 */
  constructor(
    private router: Router,
    private alertCtrl: AlertController,
    private evento: EventoService
    ) { }

  ngOnInit() {
  }

  acessarPagina(pagina){
    if(pagina==SalasOffTopicPage){
      this.is_online = this.evento.getIsOnline()
      if(this.is_online==1)
        this.router.navigate(['salas-off-topic']);
      else
        this.ajudaGeral();
    }else{
      this.router.navigate(['opcoes-enviar-perguntas']);
    }
  }

  ajudaGeral() {
    this.mostraAlerta("Atenção",
        "<html>" +
        "Esta funcionalidade é restrita para eventos online<br><br>" +
        "</html>");
  }

  private mostraAlerta(titulo: string, subtitulo: string) {
    let alert = this.alertCtrl.create({
      header: 'titulo',
      message: 'subtitulo',
      buttons: ['OK']
    });

}
}
