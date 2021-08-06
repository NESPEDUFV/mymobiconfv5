import { Injectable,Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

/**
 * Conexões com o servidor relacionadas às salas
 */
export class ServSalas {
    /**
     * @param http Usado para fazer os requests HTTP
     * @param url URL do servidor
     */
    constructor(private http: HttpClient, @Inject(String) private url: string) { }

    /**
     * Busca a lista de salas
     * @param eventoID ID do evento cujas salas serão buscadas
     */
    buscar(eventoID: string) {
        return this.http.post(this.url + "/App/listaSalasOffTopic.php", {
            ID_EVENTO: eventoID
        });
    }
}
