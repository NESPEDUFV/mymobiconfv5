import { ParceirosService, ParceiroInterface } from './../../services/parceiros.service';
import { EstadoLista } from 'src/app/enums/estado-lista.enum';
import { EventoService } from 'src/app/services/evento.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-parceiros',
  templateUrl: './parceiros.page.html',
  styleUrls: ['./parceiros.page.scss'],
})
export class ParceirosPage implements OnInit {

   /** @ignore */
   enumEstado = EstadoLista; //Disponibiliza o enum para o template
   /** Estado de carregamento da lista */
   estado: EstadoLista = EstadoLista.Carregando;
   /** Lista dos parceiros */
   listaParceiros: ParceiroInterface[];

   /** Definição do tamanho de cada card do patrocinador, de acordo com sua prioridade */
   tamanhoCard: string[] = ['large', 'large', 'small', 'small'];
   /** Definição da medalha de cada patrocinador, de acordo com sua prioridade */
   imgMedalha: string[] = [
       'assets/img/medalha-diamante.png',
       'assets/img/medalha-ouro.png',
       'assets/img/medalha-prata.png',
       'assets/img/medalha-bronze.png'
   ];

  /**
     * @param parceiros
     * @param evento Usado para adquirir o ID do evento
     */
  constructor(private parceiros: ParceirosService, private evento: EventoService) { }

  ngOnInit() {
  }

   /**
     * Ao entrar na página, chama o método `carregar`
     */
    ionViewWillEnter() {
      this.carregar();
  }

  /**
     * Carrega a lista de parceiros, chamada também ao puxar o refresher
     * @param refresher Refresher da página
     */
    carregar(refresher?) {
        this.estado = EstadoLista.Carregando;
        this.parceiros.buscar(this.evento.getID(), () => {
            this.listaParceiros = this.parceiros.listarPorPrioridade();
            this.estado = EstadoLista.Sucesso;
            if (refresher) refresher.complete();
        }, () => {
            this.estado = EstadoLista.Falha;
            if (refresher) refresher.complete();
        });
    }


}
