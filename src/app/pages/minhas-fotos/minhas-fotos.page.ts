import { UsuarioService } from './../../services/usuario.service';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { AlbumService } from 'src/app/services/album.service';
import { EventoService } from 'src/app/services/evento.service';


interface LocalFile {
	name: string;
	path: string;
	data: string;
}

@Component({
  selector: 'app-minhas-fotos',
  templateUrl: './minhas-fotos.page.html',
  styleUrls: ['./minhas-fotos.page.scss'],
})


export class MinhasFotosPage implements OnInit {

  images:  any[]= []
  userId:string='';
  eventoId: string = '';
  album;
  constructor(private albumService: AlbumService, private userService: UsuarioService, private eventoService: EventoService) { }

  async ngOnInit() {

     await this.getAlbum();



  }

   async getAlbum(){

    this.userId = this.userService.getID();
    this.eventoId = this.eventoService.getID();
    this.albumService.getAlbumID(this.eventoId).subscribe((album)=>{
    console.log('album: ',album);
    this.album = album;
    this.getImages();
   })
  }

  getImages(){
    this.albumService.getImagesByUsrId(this.userId, this.album.idAlbum as string).subscribe((images: any[]) => {
      console.log('images dentro subscribe: ', images)
      this.images = images;
    });
  }

  startUpload(file:LocalFile){

  }
  deleteImage(file:LocalFile){

  }
  selectImage(){

  }
}
