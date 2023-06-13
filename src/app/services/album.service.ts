import { UsuarioService } from './usuario.service';
import { EventoService } from './evento.service';
import { Figurinha } from './../models/figurinha';
import { Injectable } from '@angular/core';
import { ServidorService } from './servidor/servidor.service';
import { v4 as uuidv4 } from 'uuid';
import { Storage } from '@ionic/storage';
import { ToastController } from '@ionic/angular';
@Injectable({
  providedIn: 'root'
})
export class AlbumService {
  album;



  constructor(private servidor: ServidorService, private eventoService: EventoService,
    private usuarioService:  UsuarioService, private storage: Storage,public toastController: ToastController) { }


  salvar(idEvento){
    this.servidor.album.getAlbumEventoId(idEvento).subscribe((resp) => {
      this.album = resp;
    });
    this.storage.set('album', JSON.stringify(this.album));

  }

  getAlbum(){
    const eventoId =  this.eventoService.getID();
    console.log('evento id:     ', eventoId)
    this.servidor.album.getAlbumEventoId(eventoId).subscribe((res)=>{
      this.album = res;
    })

    return this.album;
  }
  getImagesByUsrId(userId:string,idAlbum: string) {
    return this.servidor.album.getImagesByUserId(userId,idAlbum);
  }

  postImagem(foto: any, idAtividade: number) {
    const idUsuario = this.usuarioService.getID();
    const Album = this.getAlbum();
    const currentDateTime = new Date().toISOString();
    const dateOnly = currentDateTime.substring(0, 10);
    const figurinha: Figurinha = {
      ID_IMAGEM: this.generateGUID(),
      FOTO: foto,
      ID_PARTICIPANTE: idUsuario,
      ID_ATIVIDADE_REFERENTE: idAtividade ? idAtividade : 0,
      DATETIME: dateOnly,
      PONTOS: 10,
      ID_ALBUM: Album.idAlbum
    };

    this.servidor.album.postImage(figurinha).subscribe(
      (response) => {
        this.presentToastSuccess();
      },
      (error) => {
        return false;
      }
    );

  }

  async presentToastSuccess() {
    console.log('toastsucess')
    const toast = await this.toastController.create({
      header: 'Sua foto foi compartilhada com a organização',
      message: 'Quando o album for publicado você pode conferir esse e outros registros! ',
      position: 'top',
      duration: 2000,
      color: 'success'
    });
    toast.present();
  }

  async presentToastError() {
    console.log('toastError')
    const toast = await this.toastController.create({
      message: 'Ocorreu um erro no nosso servidor, tente novamente! ',
      duration: 2000,
    });
    toast.present();
  }


  getAllAbumFotos(idAlbum:string){
    return this.servidor.album.getAlbum(idAlbum);
  }

  generateGUID(): string {
    return uuidv4();
  }

}

export interface UserPhoto {
  filepath: string;
  webviewPath: string;
}
