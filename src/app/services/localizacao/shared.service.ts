import { Injectable } from '@angular/core';
import { Node } from './localizacao.service';

@Injectable({
  providedIn: 'root'
})

export class LocationSharedVariables {
  //Dados retornados para a tela de escolher-destino
  public pickedPosition: Node;
  public userPickedPosition: boolean = false;

  //Dados enviados para a seleção de ponto manual
  public nodes: Node[];
  
  //Dados enviados para o sistema de navegação
  public route: Node[]
  constructor() { }
}