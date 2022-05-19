import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServOpnioes {

 /**
     * @param http Usado para fazer os requests HTTP
     * @param url URL do servidor
     */
  constructor(private http: HttpClient, @Inject(String) private url: string) { }

  /**
   * Envia uma opinião sobre um evento
   * @param opiniao Texto da opinião
   * @param usuarioID ID do usuário enviando a opinião
   * @param eventoID ID do evento sobre o qual está opinando
   */
  enviar(opiniao: string, usuarioID: string, eventoID: string, anonimo:boolean) {
      return this.http.post(this.url + "/App/enviaOpiniaoApp.php", {
          OPINIAO: opiniao,
          ID_PARTICIPANTE: usuarioID,
          ID_EVENTO: eventoID,
          ANONIMO:anonimo
      });
  }}
