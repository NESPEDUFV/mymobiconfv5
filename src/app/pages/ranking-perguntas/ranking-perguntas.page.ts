import { UsuarioService } from './../../services/usuario.service';
import { AtividadeInterface } from './../../services/atividades.service';
import { EstadoLista } from './../../enums/estado-lista.enum';
import { EventoService } from './../../services/evento.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-ranking-perguntas',
  templateUrl: './ranking-perguntas.page.html',
  styleUrls: ['./ranking-perguntas.page.scss'],
})
export class RankingPerguntasPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
