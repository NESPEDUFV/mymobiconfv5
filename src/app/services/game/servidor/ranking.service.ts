import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServRankingGame {

  constructor(private http: HttpClient, @Inject(String) private url: string, @Inject(String) private key: string) { }

  rankearParticipantes(eventoID: number, tipo: number) {
    return this.http.post(this.url + "/App/game/ranking/listarParticipantes.php", {
        key: this.key,
        idEvento: eventoID,
        tipo: tipo
    });
}

rankearParticipantesEncerrado(eventoID: number) {
    return this.http.post(this.url + "/App/game/ranking/listarRankingEncerrado.php", {
        key: this.key,
        ID_EVENTO: eventoID
    });
}

rankearAtividade(eventoID: number, tipo: number) {
    return this.http.post(this.url + "/App/game/ranking/listarAtividades.php", {
        key: this.key,
        idEvento: eventoID,
        tipo: tipo
    });
}

rankearGrupos(eventoID: number, tipo: number) {
    return this.http.post(this.url + "/App/game/ranking/listarGrupo.php", {
        key: this.key,
        idEvento: eventoID,
        tipo: tipo
    });
}

}
