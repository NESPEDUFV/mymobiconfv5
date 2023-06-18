import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { ConfigPage } from './pages/config/config.page';
import { EventosPage } from './pages/eventos/eventos.page';
import { SobrePage } from './pages/sobre/sobre.page';
import { Platform } from '@ionic/angular';
import { Location } from '@angular/common';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { OverlayService } from './services/overlay.service';
import { App as CapacitorApp } from '@capacitor/app';



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
    private platform: Platform,
    private location: Location,
    private statusBar: StatusBar,
    private overlay: OverlayService
  ) {


    this.initializyApp();

}

initializyApp(){

  CapacitorApp.addListener('backButton', ({canGoBack}) => {

    if(!canGoBack){
      CapacitorApp.exitApp();
    } else {
      this.location.back();
    }
  });
 const color = '#104BAD';
  let cache = { [0]: color, [-0.5]: '#082657', [-0.7]: '#051734' }
 this.platform.ready().then(() => {
  this.statusBar.backgroundColorByHexString(color);
  this.overlay.get().subscribe((val: number) => {
    this.statusBar.backgroundColorByHexString('#00A0E4');
 });

 }
 );





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
