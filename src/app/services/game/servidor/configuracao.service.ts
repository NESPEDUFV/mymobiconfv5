import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServConfiguracoesGame {

   /**
   * @param http Usado para fazer os requests HTTP
   * @param url URL do servidor
   * @param key Chave para realizar alteração no banco
   */
  constructor(private http: HttpClient, @Inject(String) private url: string,  @Inject(String) private key: string) { }


  carregarConfiguracoes(eventoID: any) {
    console.log("bateu aqui",eventoID);
    return this.http.post(this.url + "/App/game/configuracoes.php", {
        key: this.key,
        idEvento: eventoID
    });
}

carregarHashtags(eventoID: any) {
    return this.http.post(this.url + "/App/game/atividade/listarHashtag.php", {
        key: this.key,
        idEvento: eventoID
    });
}
}
