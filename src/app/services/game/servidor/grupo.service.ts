import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServGrupoGame {

  constructor(private http: HttpClient, @Inject(String) private url: string, @Inject(String) private key: string) { }

  visualizarPerfil(usuarioID: number, eventoID: number) {
      return this.http.post(this.url + "/App/game/participante/visualizarPerfil.php", {
          key: this.key,
          idEvento: eventoID,
          idUsuario: usuarioID
      });
  }


  visualizarGrupo(idGrupo: number, idEvento: number) {
      return this.http.post(this.url + "/App/game/grupo/visualizarGrupo.php", {
          key: this.key,
          idEvento: idEvento,
          idGrupo: idGrupo
      });
  }


  visualizarComentarios(idGrupo: number, idEvento: number, ultimo: number) {
      return this.http.post(this.url + "/App/game/grupo/visualizarComentarios.php", {
          key: this.key,
          idEvento: idEvento,
          idGrupo: idGrupo,
          ultimo: ultimo
      });
  }

  sairGrupo(idGrupo: number, idUsuario: number) {
      return this.http.post(this.url + "/App/game/grupo/sairGrupo.php", {
          key: this.key,
          idUsuario: idUsuario,
          idGrupo: idGrupo
      });
  }

  solicitarEntradaGrupo(idGrupo: number, idUsuario: number, idEvento: number) {
      return this.http.post(this.url + "/App/game/grupo/solicitarEntradaGrupo.php", {
          key: this.key,
          idUsuario: idUsuario,
          idGrupo: idGrupo,
          idEvento: idEvento
      });
  }

  aceitarEntradaGrupo(idGrupo: number, idUsuario: number, idEvento: number, aceita: boolean) {
      return this.http.post(this.url + "/App/game/grupo/aceitarEntradaGrupo.php", {
          key: this.key,
          idUsuario: idUsuario,
          idGrupo: idGrupo,
          idEvento: idEvento,
          aceita: aceita
      });
  }

  editarGrupo(idGrupo: number, nome: string, descricao: string, imagem: number) {
      return this.http.post(this.url + "/App/game/grupo/editarGrupo.php", {
          key: this.key,
          idGrupo: idGrupo,
          nome: nome,
          descricao: descricao,
          imagem: imagem
      });
  }

  criarGrupo(idUsuario: number, idEvento: number, nome: string, descricao: string, imagem: number, identificador: string) {
      return this.http.post(this.url + "/App/game/grupo/criarGrupo.php", {
          key: this.key,
          idUsuario: idUsuario,
          idEvento: idEvento,
          nome: nome,
          descricao: descricao,
          imagem: imagem,
          identificador: identificador
      });
  }


  visualizarParticipantes(idGrupo: number, idEvento: number) {
      return this.http.post(this.url + "/App/game/grupo/visualizarParticipantes.php", {
          key: this.key,
          idGrupo: idGrupo,
          idEvento: idEvento,
          aceitoGrupo: 1
      });
  }

  visualizarPedidos(idGrupo: number, idEvento: number) {
      return this.http.post(this.url + "/App/game/grupo/visualizarParticipantes.php", {
          key: this.key,
          idGrupo: idGrupo,
          idEvento: idEvento,
          aceitoGrupo: 0
      });
  }

  excluirGrupo(idGrupo: number, idEvento: number) {
      return this.http.post(this.url + "/App/game/grupo/excluirGrupo.php", {
          key: this.key,
          idGrupo: idGrupo,
          idEvento: idEvento
      });
  }

}
