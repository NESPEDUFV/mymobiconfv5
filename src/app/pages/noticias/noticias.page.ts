import { FirebaseService } from './../../services/firebase/firebase.service';
import { EstadoLista } from './../../enums/estado-lista.enum';
//import { NoticiaPage } from './../noticia/noticia.page';
import { NoticiaService, NoticiaInterface } from './../../services/noticia.service';
import { EventoService } from './../../services/evento.service';
import { NavigationExtras, Router } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';


@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.page.html',
  styleUrls: ['./noticias.page.scss'],
})
export class NoticiasPage implements OnInit {

  @ViewChild(IonContent) content: IonContent;
    //Disponibilizar enum para o HTML
    /** @ignore */
    enumEstado = EstadoLista;

    /** Lista das notícias */
    lista: NoticiaInterface[] = [];
    /** Estado do carregamento da lista */
    estado: EstadoLista = EstadoLista.Carregando;

    hasScrollbar = true;





  /**
   * @param router Usado para exibir a página de uma notícia
   * @param noticias
   * @param evento Usado para adquirir o ID do evento
   */
  constructor(
    private router: Router,
    private noticias: NoticiaService,
    private evento: EventoService,
    private firebaseNotifica: FirebaseService
  ) { }

  ngOnInit() {
  }

   /**
     * Ao entrar na página, chama o método `carregar`
     */

    ionViewWillEnter() {
      this.firebaseNotifica.leuNoticia()
      this.carregar();

    }


   /**
     * Carrega a lista de notícias, também chamada ao se puxar o refresher
     * @param refresher Refresher da página
     */
    carregar(refresher?) {
      this.estado = EstadoLista.Carregando;
      this.noticias.buscar(this.evento.getID(), () => {
          this.lista = this.noticias.getLista();
          this.estado = EstadoLista.Sucesso;
          this.checkForScrollbar()
          if (refresher) refresher.complete();
      }, () => {
          this.estado = EstadoLista.Falha;
          if (refresher) refresher.complete();
      });
  }

  /**
   * Acessa a página de uma notícia
   * @param noticia Notícia a ser acessada
   */
  acessarNoticia(noticia: NoticiaInterface) {
    console.log(noticia.hora);
    let navigationExtras: NavigationExtras = {
      state: {
        not : noticia,
       }
      }
      this.router.navigate(['noticia'],navigationExtras)
  }


  scrollToBottom(){
      this.hasScrollbar = false;
      //let dimensions = this.content.getContentDimensions();
      this.content.scrollToBottom(1500);
  }

  detectBottom(){
      //let dimensions = this.content.getContentDimensions();
      console.log("innerHeight "+ window.innerHeight)
      console.log("body Offseet "+ document.body.offsetHeight)
      console.log("windows pageY "+ window.pageYOffset)


      if((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight){
        return true
      }
      else {
          return false
      }
  }

  async checkForScrollbar() {
      /*
      const scrollElement =  await this.content.getScrollElement();
      if(this.hasScrollbar == false){ return false}
      return scrollElement.scrollHeight > scrollElement.clientHeight
*/
  }


}
