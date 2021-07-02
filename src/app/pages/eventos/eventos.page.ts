import { EventoInscricaoPage } from './../evento-inscricao/evento-inscricao.page';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { EventoService, EventoInterface } from 'src/app/services/evento.service';
import { EstadoLista } from 'src/app/enums/estado-lista.enum';
import { EventoInscricaoPageRoutingModule } from '../evento-inscricao/evento-inscricao-routing.module';


@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.page.html',
  styleUrls: ['./eventos.page.scss'],
})
export class EventosPage implements OnInit {

   /** Lista completa dos eventos */
   listaEventos: EventoInterface[] = [];
   /** Lista dos eventos filtrada com a busca */
   listaFiltrada: EventoInterface[] = [];
   /** Filtro da busca, digitado pelo usuário */
   filtroBusca: string;

   /** Estado de carregamento da lista de eventos */
   estadoLista: EstadoLista;
   /** @ignore */
   enumEstado = EstadoLista; //Disponibilizar para o template

   /**
    * @param router Usado para mostrar novas páginas
    * @param config Usado para o tutorial
    * @param evento
    */

  constructor(

    private router: Router,
    public  evento: EventoService
  ) { }

   /**
     * Ao entrar na página, chama o método `carregar`
     */
    ionViewWillEnter() {
      this.carregar();
  }

  /**
     * Carrega a lista de eventos, é chamada também ao se puxar o refresher
     * @param refresher Refresher da página para recarregar os dados
     */
    //SEM TUTORIAL POR ENQUANTO
   carregar(refresher?) {
     /*
    let ativarTut = () => {
        setTimeout(() => {
            if (!this.config.tutorialFoiVisto(PassosTutorial.ListaEventos)) {
                this.passos[0].el = this.lista;
                this.ativarTut = true;
            }
        }, 200);
    };*/
    this.estadoLista = EstadoLista.Carregando;
    this.evento.buscarLista((listaOn: EventoInterface[]) => {
        this.listaEventos = listaOn;
        this.listaFiltrada = listaOn;
        this.estadoLista = EstadoLista.Sucesso;
        //ativarTut();
        if (refresher) refresher.complete();
    }, (listaLocal: EventoInterface[]) => {
        this.listaEventos = listaLocal;
        this.listaFiltrada = listaLocal;
        this.estadoLista = EstadoLista.Sucesso;
        //ativarTut();
        if (refresher) refresher.complete();
    }, () => {
        this.estadoLista = EstadoLista.Falha;
        if (refresher) refresher.complete();
    });
  }

  /**
     * Faz a filtragem da lista a partir do input de busca
     */
   buscaInput() {
    this.listaFiltrada = this.listaEventos;
    if (this.estadoLista == EstadoLista.Sucesso && this.filtroBusca && this.filtroBusca.trim() != '') {
        this.listaFiltrada = this.listaFiltrada.filter((ev) => {
            return (ev.nome.toLowerCase().indexOf(this.filtroBusca.toLowerCase()) > -1) ||
                (ev.local.toLowerCase().indexOf(this.filtroBusca.toLowerCase()) > -1);
        });
    }
}

/**
     * Acessa página de um dos eventos da lista
     * @param evento Evento a ser acessado
     */
 acessarEvento(evento: EventoInterface) {
 // console.log("Gamification "+evento.gamificacao)
  this.router.navigate(['evento-inscricao']);
 /*
  this.router.navigate(EventoInscricaoPage, {
    eventoEscolhido: evento,
    desinscrever: this.evento.existeDados() && evento.ID == this.evento.getID()
});
*/
}

 /**
     * Chamada sempre que o usuário clica no tutorial
     * @param passo Passo do tutorial que foi visto
     */

 /*
  viuTutorial(passo: number) {
    if (passo == -1 || passo == this.passos.length) {
        this.ativarTut = false;
        this.config.tutorialMarcarVisto(PassosTutorial.ListaEventos);
    }
}
*/

  ngOnInit() {
  }

}
