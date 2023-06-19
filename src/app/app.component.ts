import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { ConfigPage } from './pages/config/config.page';
import { EventosPage } from './pages/eventos/eventos.page';
import { SobrePage } from './pages/sobre/sobre.page';
import { StatusBar } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

   /** Descreve as os botões do menu lateral (Eventos, Configuraçẽoes e Sobre) */
   paginas: { nome: string, p: any, icone: string, caminho: string }[] = [
    { nome: "Eventos", p: EventosPage, icone: "symbol", caminho:"/eventos" },
    { nome: "Configurações", p: ConfigPage, icone: "configuracao", caminho:"config" },
    { nome: "Sobre", p: SobrePage, icone: "noticias", caminho:"sobre" }
];
 /** @ignore */
 pushCheck: boolean = false;


  constructor(
    private router: Router,
    private platform: Platform
  ) {
    this.platform.ready().then(() => StatusBar.setOverlaysWebView({ overlay: false }));    
  }

      /**
     * Chamada quando se clica em algum botão do menu, exibindo a página correspondente
     * @param pagina Página correspondente ao botão clicado
     */
       menuAcessar(pagina) {
        if (!this.pushCheck) {
            this.pushCheck = true;
            setTimeout(() => {
                this.router.navigateByUrl(pagina)
                this.pushCheck = false;
            }, 120);
        }
    }

}
