import { Router } from '@angular/router';
import { SalasOffTopicService, SalasOffTopicInterface } from './../../services/salas-off-topic.service';
import { EstadoLista } from './../../enums/estado-lista.enum';
import { EventoService } from './../../services/evento.service';
import { IonContent } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';


@Component({
  selector: 'app-salas-off-topic',
  templateUrl: './salas-off-topic.page.html',
  styleUrls: ['./salas-off-topic.page.scss'],
})
export class SalasOffTopicPage implements OnInit {
  @ViewChild(IonContent, {read: IonContent}) content: IonContent;
  //Disponibilizar enum para o HTML
  /** @ignore */
  enumEstado = EstadoLista;

  /** Lista das salas */
  lista: SalasOffTopicInterface[];
  /** Estado do carregamento da lista */
  estado: EstadoLista = EstadoLista.Carregando;

  hasScrollbar = true;

  /**
   * @param Router Usado para exibir a página de uma sala off-topic
   * @param salas Usado para acessar as salas off-topic
   * @param evento Usado para adquirir o ID do evento
   */
  constructor(
        private salas: SalasOffTopicService,
        private evento: EventoService,
  ) { }

  ngOnInit() {
  }

   /**
     * Carrega a lista de salas off-topic, também chamada ao se puxar o refresher
     * @param refresher Refresher da página
     */
    carregar(refresher?) {
      this.estado = EstadoLista.Carregando;
      this.salas.buscar(this.evento.getID(), () => {
          this.lista = this.salas.getLista();
          this.estado = EstadoLista.Sucesso;
         // this.doRefresh()
          if (refresher) refresher.complete();
      }, () => {
          this.estado = EstadoLista.Falha;
          if (refresher) refresher.complete();
      });
  }

  ScrollToBottom(){
    setTimeout(() => {
      this.content.scrollToBottom(300);
   }, 1000);

  }

  /*
detectBottom(){
    let dimensions = this.content.getContentDimensions();
    console.log("innerHeight "+ window.innerHeight)
    console.log("body Offseet "+ document.body.offsetHeight)
    console.log("windows pageY "+ window.pageYOffset)


    if((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight){
      return true
    }
    else {
        return false
    }
    */
}









  /*checkForScrollbar() {
    const scrollElement =  this.content.getScrollElement();
    if(this.hasScrollbar == false){ return false}
    return scrollElement.scrollHeight > scrollElement.clientHeight
}
*/




