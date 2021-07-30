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
import { EventoService } from 'src/app/services/evento.service';
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
    public menuCtrl: MenuController
  ) { }

  ngOnInit() {
  }
    /** Define os botões principais */
    botoes: { id: string, label: string}[] = [
      { id: "atividades", label: "Atividades"   },
      { id: "questionarios", label: "Questionários"  },
      { id: "opinar", label: "Opinar"  },
      { id: "parceiros", label: "Parceiros" },
      { id: "noticias", label: "Notícias"},
      { id: "social", label: "Social"}
  ];



   /**
     * Concede acesso às partes principais do app, se estiver em um evento
     * @param pagina Página a ser acessada
     */



}
