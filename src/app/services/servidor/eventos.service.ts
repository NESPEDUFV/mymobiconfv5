import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServEventos {

  /**
     * @param http Usado para fazer os requests HTTP
     * @param url URL do servidor, o '@Inject' é necessario apenas em tipos primitivos.
     */
  constructor(private http: HttpClient, @Inject(String) private url: string) { }

  /**
     * Carrega a lista de eventos
     */
   buscar() {
    return this.http.post(this.url + "/App/listaEventosApp.php", "");
}

/**
 * Busca informações extra sobre o evento (site, email e telefone)
 * @param eventoID ID do evento cujas informações serão buscadas
 */
buscarInfo(eventoID: string) {
    return this.http.post(this.url + "/App/listaEventoInformacoes.php", {
        ID_EVENTO: eventoID
    });
}

/**
 * Atualiza o ID do evento na tabela participante
 * @param eventoID ID do evento
 * @param usuarioID ID do usuário
 */
atualizarParticipante(eventoID: string, usuarioID: string, dispositivoID: string) {
    return this.http.post(this.url + "/App/atualizaParticipante.php", {
        ID_EVENTO: eventoID,
        ID_PARTICIPANTE: usuarioID,
        ID_DISPOSITIVO: dispositivoID
    });
}



}
