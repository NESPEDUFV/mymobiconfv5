import { ServidorService } from './servidor/servidor.service';
import { ArmazenamentoService } from './armazenamento.service';
import { Injectable } from '@angular/core';


/** Dados de uma notícia */
export interface NoticiaInterface {
  /** ID da notícia */
  ID: string
  /** Título da notícia */
  titulo: string
  /** Corpo do texto da notícia */
  corpo: string
  /** Hora em que a notícia foi lançada */
  hora: Date
}


@Injectable({
  providedIn: 'root'
})
export class NoticiaService {
/** Armazena as notícias já baixadas */
private noticias: NoticiaInterface[];
/** @ignore */
private _carregou: boolean = false;
/** @ignore */
private _existeDados: boolean = false;

constructor(private storage: ArmazenamentoService, private servidor: ServidorService) {
    this.noticias = [];
}

getLista(): NoticiaInterface[] { return this.noticias; }

/**
 * Salva os dados da lista de notícias
 */
salvar() {
    this.storage.set('noticias', JSON.stringify(this.noticias));
}

/**
 * Carrega a lista de notícias do armazenamento local
 * @param cb Callback para quando se termina de carregar
 */
carregar(cb?: () => void) {
    this.storage.get('noticias').then((val) => {
        let noticias = JSON.parse(val);
        this.noticias = noticias || [];
        this._existeDados = (noticias) ? true : false;
        for (let i in this.noticias) {
            //Após serem armazenadas, as datas viram strings que podem ser transformadas
            // de volta em objetos inserindo-as na construção de um novo Date
            // h deve ser do tipo any para permitir essa readequação de tipos
            let h: any = this.noticias[i].hora;
            this.noticias[i].hora = new Date(h);
        }
        this._carregou = true;
        if (cb) cb();
    });
}

/**
 * Apaga a lista de notícias
 */
apagar() {
    this.noticias = [];
    this.storage.remove('noticias');
}

/**
 * Executa uma dada ação após garantir que os dados das notícias foram carregados
 * @param sucessoCb Callback executada após garantir que os dados das notícias foram carregados
 * @param falhaCb Callback executada após falha no carregamento das notícias
 */
disponivel(sucessoCb: () => void, falhaCb?: () => void) {
    if (this._carregou)
        sucessoCb();
    else
        this.carregar(() => {
            if (this._existeDados)
                sucessoCb();
            else if (falhaCb) falhaCb();
        });
}

/**
 * Busca a lista de notícias
 * @param eventoID ID do evento cujas notícias serão buscadas
 * @param sucessoCb Callback para quando adquire os dados do servidor
 * @param falhaCb Callback para quando não há dados
 */
buscar(eventoID: string, sucessoCb?: () => void, falhaCb?: () => void) {
    this.servidor.noticias.buscar(eventoID).subscribe((data: any) => {
        this.noticias = this.formatarLista((data && data.noticias) ? data.noticias : []);
        this.salvar();
        if (sucessoCb) sucessoCb();
    }, () => {
        this.carregar(() => {
            if (this._existeDados) {
                if (sucessoCb) sucessoCb();
            } else if (falhaCb) falhaCb();
        });
    });
}

/**
 * @param noticias Lista de notícias no formato do servidor
 * @returns Lista de notícias no formato do app
 */
private formatarLista(noticias: any[]): NoticiaInterface[] {
    let ns: NoticiaInterface[] = [];
    for (let n of noticias)
        ns.push(this.formatarObj(n));
    ns.sort((b, a) => a.hora.getTime() - b.hora.getTime());
    return ns;
}

/**
 * @param noticia Notícia no formato do servidor
 * @returns Notícia no formato do app
 */
private formatarObj(noticia: any): NoticiaInterface {
    let hora: string[] = noticia.hora.match(/\S+/g);
    let data: Date = new Date(hora[0].replace(/-/g, "/"));
    let hms = hora[1].match(/\d+/g);
    data.setHours(+hms[0], +hms[1], +hms[2]);
    return {
        ID: noticia.ID_NOTICIA,
        titulo: noticia.titulo,
        corpo: noticia.corpo,
        hora: data
    };
}
}
