import { Directive, Renderer2, ElementRef } from '@angular/core';
import { Platform } from '@ionic/angular';

/** @ignore */
const bgRatio = 0.78125;

/**
 * Ajusta o plano de fundo com imagem, de forma que não haja distorção quando o teclado for aberto
 */
@Directive({
    selector: '[bg]'
})
export class BackgroundDirective {
    /** Largura da tela */
    private wd: number;
    /** Altura da tela */
    private ht: number;

    /**
     * Adquire as dimensões da tela do dispositivo
     * @param renderer Ajusta os estilos
     * @param element Referência ao elemento host da diretiva
     * @param platform Plugin Platform - usado aqui para adquirir as dimensões da tela
     */
    constructor(private renderer: Renderer2, private element: ElementRef, platform: Platform) {
        this.wd = platform.width();
        this.ht = platform.height();
    }

    /**
     * Ao inicializar, muda o estilo do elemento host para que tenha a imagem de fundo e configura suas dimensões
     */
    ngAfterViewInit() {
        this.renderer.setStyle(this.element.nativeElement, 'background', 'url("assets/img/bg.jpeg") no-repeat center top fixed');
        if (this.wd / this.ht <= bgRatio)
            this.renderer.setStyle(this.element.nativeElement, 'background-size', `auto ${this.ht}px`);
        else
            this.renderer.setStyle(this.element.nativeElement, 'background-size', `${this.wd}px auto`);
    }
}
