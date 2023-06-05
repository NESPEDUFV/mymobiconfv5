import { UsuarioService } from './usuario.service';
import { EventoService } from './evento.service';
import { Figurinha } from './../models/figurinha';
import { Injectable } from '@angular/core';
import { ServidorService } from './servidor/servidor.service';
import { v4 as uuidv4 } from 'uuid';
import { Storage } from '@ionic/storage';
@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  album;

  constructor(private servidor: ServidorService, private eventoService: EventoService,
    private usuarioService:  UsuarioService, private storage: Storage) { }


  salvar(idEvento){
    this.servidor.album.getAlbumEventoId(idEvento).subscribe((resp) => {
      this.album = resp;
    });
    this.storage.set('album', JSON.stringify(this.album));

  }

  getAlbum(){

    return this.album;
  }
  getImagesByUsrId(userId:string,idAlbum: string) {
    return this.servidor.album.getImagesByUserId(userId,idAlbum);
  }

  postImagem(foto: any, idAtividade: number) {
    const idUsuario = this.usuarioService.getID();
    const currentDateTime = new Date().toISOString();
    const dateOnly = currentDateTime.substring(0, 10);
    const figurinha: Figurinha = {
      ID_IMAGEM: this.generateGUID(),
      FOTO: foto,
      ID_PARTICIPANTE: idUsuario,
      ID_ATIVIDADE_REFERENTE: idAtividade,
      DATETIME: dateOnly,
      PONTOS: 10,
      ID_ALBUM: this.album.idAlbum
    };

    this.servidor.album.postImage(figurinha).subscribe(
      (response) => {
        console.log('postimage response', response);
        // Lógica para lidar com a resposta do servidor aqui
      },
      (error) => {
        console.error('postimage error', error);
        // Lógica para lidar com erros da chamada HTTP aqui
      }
    );
  }

  generateGUID(): string {
    return uuidv4();
  }

}
