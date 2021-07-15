import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Inject} from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class ServParceiros {
   /**
     * @param http Usado para fazer os requests HTTP
     * @param url URL do servidor
     */
    constructor(private http: HttpClient, @Inject(String) private url: string) { }

    /**
     * Busca a lista de parceiros
     * @param eventoID ID do evento cujos parceiros serão buscados
     */
    buscar(eventoID: string) {
        return this.http.post(this.url + "/App/listaPatrocinadores.php", {
            ID_EVENTO: eventoID
        });
    }
}
