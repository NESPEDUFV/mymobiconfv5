import { Figurinha } from './../models/figurinha';
import { Injectable } from '@angular/core';
import { ServidorService } from './servidor/servidor.service';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  constructor(private servidor: ServidorService) { }


  getAlbumID(idEvento){
    return this.servidor.album.getAlbumEventoId(idEvento);
  }
  getImagesByUsrId(userId:string,idAlbum: string) {
    return this.servidor.album.getImagesByUserId(userId,idAlbum);
  }

  postImagem(foto: any){/*
    const figurinha: Figurinha = {
      ID_IMAGEM: 1,
      FOTO: foto,
      ID_PARTICIPANTE: 2,
      ID_ATIVIDADE_REFERENTE: 3,
      DATETIME: new Date().toISOString(),
      PONTOS: 10,
      ID_ALBUM: 4
    };
    */
  }
}
