import { Router } from '@angular/router';
import { EventoService } from './../../../services/evento.service';
import { EventoInfoPage } from './../../evento-info/evento-info.page';
import { SocialPage } from './../../social/social.page';
import { NoticiasPage } from './../../noticias/noticias.page';
import { ParceirosPage } from './../../parceiros/parceiros.page';
import { QuestionariosPage } from './../../questionarios/questionarios.page';
import { AtividadesPage } from './../../atividades/atividades.page';
import { EventosPage } from './../../eventos/eventos.page';
import { LoginPage } from './../../login/login.page';
import { OverlayService } from './../../../services/overlay.service';
import { AtividadesService,AtividadeInterface } from './../../../services/atividades.service';
import { UsuarioService } from './../../../services/usuario.service';
import { ConfigService } from './../../../services/config.service';
import { DatasUtil } from './../../../utils/datas';
import {OpinarPage} from '../../opinar/opinar.page';
import { MenuController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-my-mobi-conf',
  templateUrl: './my-mobi-conf.page.html',
  styleUrls: ['./my-mobi-conf.page.scss'],
})
export class MyMobiConfPage implements OnInit {


   /** Data corrent */
   data: Date;


   /** @ignore */
   private ready: boolean = false; // Impede que outras coisas apareçam antes de todos os dados estarem carregados
  constructor(
    public menuCtrl: MenuController,
    private evento: EventoService,
    private overlay: OverlayService,
    private router: Router,
  ) { }

  ngOnInit() {
  }
    /** Define os botões principais */
    botoes: { id: string, label: string, pagina: string}[] = [
      { id: "atividades", label: "Atividades", pagina: 'atividades' },
      { id: "questionarios", label: "Questionários", pagina: 'questionarios'  },
      { id: "opinar", label: "Opinar", pagina: 'opinar'  },
      { id: "parceiros", label: "Parceiros", pagina: 'parceiros'  },
      { id: "noticias", label: "Notícias", pagina:'noticias'},
      { id: "social", label: "Social", pagina: 'social'}
  ];



   /**
     * Concede acesso às partes principais do app, se estiver em um evento
     * @param pagina Página a ser acessada
     */
    acessarPagina(pagina: any) {
      console.log("botão clicado");
      console.log(pagina);
      //if (!this.ready) return;
      if (this.evento.existeDados()){
        console.log("dentro if\n");
        this.router.navigate([pagina]);
      }

          //this.navCtrl.push(pagina, { participa: this.participaGame });
      else
          this.alertEvento();
  }


   /**
     * Apresenta um alerta de nenhum evento inscrito
     */
    private alertEvento() {
      console.log("sem inscrição em evento\n");
      this.overlay.createAlert(
          "Nenhum evento inscrito",
          "Por favor, inscreva-se em um evento.",
          'OK'
      );
      /** quebrando aqui precisa lembrar o usuario*/
      this.router.navigate(['eventos']);
  }



}
