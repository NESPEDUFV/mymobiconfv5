import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
/**
 * Mostra cinco estrelas para que o usuário possa avaliar uma atividade.
 * Permite que o usuário toque ou deslize pelas estrelas para avaliar.
 */
 @Component({
  selector: "avaliacao",
  template: `
      <ion-grid (pan)="update($event,-1)">
          <ion-row>
              <ion-col *ngFor="let i of [1,2,3,4,5]" (click)="update($event,i)">
                  <img [src]="(nota >= i)?'assets/img/star.svg':'assets/img/star-outline.svg'" [id]="'star'+i"
                      [style.opacity]="(ativar) ? '1' : '0.6'">
              </ion-col>
          </ion-row>
      </ion-grid>
  `,
  styles: [`
      ion-col {
          padding: 3px;
          text-align: center;
      }
      img {
          width: 100%;
      }
  `]
})
export class AvaliacaoComponent {
  /** Controla se a votação está disponível ou não */
  @Input('ativar') ativar: boolean = false;
  /** Nota corrente */
  @Input() nota = 0;
  /** Emite em qual nota o usuário está votando */
  @Output() private notaChange = new EventEmitter<number>();

  /** @ignore */
  constructor() { }

  /**
   * Chamada sempre que há uma atualização da nota
   * @param ev Evento de entrada (clique/toque ou deslize)
   * @param i Índice da estrela tocada
   */
  update(ev, i) {
      if (this.ativar) {
          if (ev.type == 'click')
              this.nota = (this.nota == i) ? 0 : i;
          else if (ev.center) {
              let element = document.elementFromPoint(ev.center.x, ev.center.y);
              let id: string = (element) ? element.id : "";
              if (id.match(/star\d/))
                  this.nota = +id.match(/star(\d)/)[1];
          }
          this.notaChange.emit(this.nota);
      }
  }
}
