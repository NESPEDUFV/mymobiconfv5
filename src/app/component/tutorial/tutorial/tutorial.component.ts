import { Platform } from '@ionic/angular';
import { OverlayService } from './../../../services/overlay.service';
import { Component, OnInit, Input, ElementRef, Renderer2, ViewChild, Output, EventEmitter,  } from '@angular/core';


/** @ignore */
const borderSize: number = 5;
/** @ignore */
const holeInit: number = 100;

@Component({
  selector: 'app-tutorial',
  template: `
        <div #msg id="msg"><p>{{steps[i]?.msg}}</p></div>
        <div #hole id="hole"></div>
        <div id="cover" (click)="onClick()"></div>
        <button #skipBtn ion-button clear color="light" id="skip-btn" (click)="skip()" [hidden]="i==steps.length-1">{{skipMsg}} > </button>
    `,
  styles: [`
    #hole {
        position: absolute;
        top: -${holeInit / 2}px;
        left: -${holeInit / 2}px;
        width: ${holeInit}px;
        height: ${holeInit}px;
        outline-style: solid;
        color: rgba(0, 0, 0, 0);
        transition: color .5s ease-in-out;
        transition: transform .5s ease-in-out;
        z-index: 20;
    }
    #cover {
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        z-index: 25;
    }
    #msg {
        position: absolute;
        z-index: 25;
        color: white;
        text-align: center;
        width: 100%;
        left: 0px;
        padding-left: ${borderSize * 2}px;
        padding-right: ${borderSize * 2}px;
        opacity: 0;
        transition: opacity .5s ease-in-out;
    }
    #skip-btn {
        position: absolute;
        right: ${borderSize * 2}px;
        z-index: 25;
        opacity: 0;
        transition: opacity .5s ease-in-out;
    }
    `]
})
export class TutorialComponent implements OnInit {

  /** Referência de controle à mensagem atual do tutorial */
  @ViewChild('msg', { read: ElementRef }) private msg: ElementRef;
    /** Referência de controle à parte de destaque */
    @ViewChild('hole', { read: ElementRef }) private hole: ElementRef;
    /** Referência de controle ao botão "Pular" */
    @ViewChild('skipBtn', { read: ElementRef }) private skipBtn: ElementRef;
    /** Array de cada passo do tutorial, contendo o elemento que deve ser destacado e qual mensagem deve ser exibida */
    @Input('steps')  steps: { el: ElementRef, msg: string }[];
    /** Mensagem para o botão "Pular" */
    @Input('skip-msg') skipMsg: string = "FINALIZAR";
    /** Emite o índice de cada passo visto do tutorial */
    @Output('check') private check = new EventEmitter<number>();
    /** Índice atual do tutorial */
    i: number = 0;
    /** Largura da tela */
    private wd: number;
    /** Altura da tela */
    private ht: number;
    /** Registra ação do botão de voltar (Android) */
    private botaoBack: Function;

    /**
     * @param platform Plugin Platform - usado para adquirir as dimensões da tela do dispositivo
     * @param renderer Renderer2 - nova versão do `Renderer`
     * @param overlay Para controlar as sobreposições que este componente faz na tela
     */
    constructor(private platform: Platform, private renderer: Renderer2, private overlay: OverlayService) {
        this.wd = platform.width();
        this.ht = platform.height();
    }

    /**
     * Ao inicializar o componente, ele exibe o tutorial, centralizando o destaque e configurando os
     * estilos e as transições de cada elemento
     */
    ngAfterViewInit() {
        //this.botaoBack = this.platform.registerBackButtonAction(() => this.skip(), 3);
        this.renderer.setStyle(this.hole.nativeElement, 'transform', `matrix(1,0,0,1,
            ${this.wd / 2},${this.ht / 2}
        )`);
        setTimeout(() => {
            this.renderer.setStyle(this.hole.nativeElement, 'outline-width', '9999px');
            this.renderer.setStyle(this.hole.nativeElement, 'color', 'rgba(0, 0, 0, 0.7)');
            this.renderer.setStyle(this.msg.nativeElement, 'opacity', '1');
            this.renderer.setStyle(this.skipBtn.nativeElement, 'opacity', '1');
            this.overlay.set(-0.7);
            this.focus();
        }, 0);
    }

    /**
     * Chamada sempre que o usuário clica/toca na tela
     */
    onClick() {
        if (this.i < this.steps.length)
            this.i++;
        this.focus();
    }

    /**
     * Muda o foco do destaque do tutorial, altera a posição da mensagem e, se necessário,
     * altera a posição do botão "Pular"
     */
    private focus() {
        this.check.emit(this.i);
        if (this.i == -1 || this.i == this.steps.length) {
            this.overlay.set(0);
            this.botaoBack();
        }
        let left, top, wd, ht;
        if (0 <= this.i && this.i < this.steps.length) {
            ({ left, top } = this.elementPosition(this.steps[this.i].el.nativeElement));
            wd = this.steps[this.i].el.nativeElement.offsetWidth;
            ht = this.steps[this.i].el.nativeElement.offsetHeight;
        } else
            left = top = ht = wd = 0;

        this.renderer.setStyle(this.hole.nativeElement, 'transform', `matrix(
                ${(wd + 2 * borderSize) / holeInit}, 0, 0, ${(ht + 2 * borderSize) / holeInit},
                ${left + wd / 2},${top + ht / 2}
            )`);
        if (top + ht < this.ht / 2) {
            this.renderer.setStyle(this.msg.nativeElement, 'bottom', null);
            this.renderer.setStyle(this.msg.nativeElement, 'top', (top + ht + 2 * borderSize) + 'px');
        } else {
            this.renderer.setStyle(this.msg.nativeElement, 'top', null);
            this.renderer.setStyle(this.msg.nativeElement, 'bottom', (this.ht - top + 2 * borderSize) + 'px');
        }
        if (top + ht < this.ht - this.skipBtn.nativeElement.offsetHeight - 2 * borderSize) {
            this.renderer.setStyle(this.skipBtn.nativeElement, 'top', null);
            this.renderer.setStyle(this.skipBtn.nativeElement, 'bottom', (2 * borderSize) + 'px');
        } else {
            this.renderer.setStyle(this.skipBtn.nativeElement, 'bottom', null);
            this.renderer.setStyle(this.skipBtn.nativeElement, 'top', (2 * borderSize) + 'px');
        }
    }

    /**
     * Calcula a posição absoluta de um elemento na tela
     * @param native Elemento HTML cuja posição é calculada
     */
    private elementPosition(native): { left: number, top: number } {
        let left = 0, top = 0;
        while (native) {
            left += native.offsetLeft - native.scrollLeft;
            top += native.offsetTop - native.scrollTop;
            native = native.offsetParent;
        }
        return { left: left, top: top };
    }

    /**
     * Chamada quando o usuário clica no botão "Pular"
     */
    skip() {
        this.i = -1;
        this.focus();
    }
  ngOnInit() {}

}
