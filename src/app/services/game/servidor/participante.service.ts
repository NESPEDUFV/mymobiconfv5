import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServParticipanteGame {

  constructor(private http: HttpClient, @Inject(String) private url: string,@Inject(String) private key: string) { }

  visualizarPerfil(usuarioID: number, eventoID: number) {
    return this.http.post(this.url + "/App/game/participante/visualizarPerfil.php", {
        key: this.key,
        idEvento: eventoID,
        idUsuario: usuarioID
    });
}

existePerfil(usuarioID: number, eventoID: number) {
    return this.http.post(this.url + "/App/game/participante/existePerfil.php", {
        key: this.key,
        idEvento: eventoID,
        idUsuario: usuarioID
    });
}

editarUsuario(idUsuario: number, idEvento: number, nome: string, celular: string, descricao: string, imagem: number) {
    return this.http.post(this.url + "/App/game/participante/editarUsuario.php", {
        key: this.key,
        idUsuario: idUsuario,
        idEvento: idEvento,
        nome: nome,
        celular: celular,
        descricao: descricao,
        imagem: imagem
    });
}

criarPerfil(idUsuario: number, idEvento: number) {
    return this.http.post(this.url + "/App/game/participante/criarPerfil.php", {
        key: this.key,
        idUsuario: idUsuario,
        idEvento: idEvento
    });
}

excluirPerfil(idUsuario: number, idEvento: number) {
    return this.http.post(this.url + "/App/game/participante/excluirPerfil.php", {
        key: this.key,
        idUsuario: idUsuario,
        idEvento: idEvento
    });
}
}
