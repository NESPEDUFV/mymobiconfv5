import { Injectable,Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
/**
 * Conexões com o servidor relacionadas às notícias
 */
export class ServNoticias {
    /**
     * @param http Usado para fazer os requests HTTP
     * @param url URL do servidor
     */
    constructor(private http: HttpClient, @Inject(String) private url: string) { }

    /**
     * Busca a lista de notícias
     * @param eventoID ID do evento cujas notícias serão buscadas
     */
    buscar(eventoID: string) {
        return this.http.post(this.url + "/App/listaNoticias.php", {
            ID_EVENTO: eventoID
        });
    }
}
