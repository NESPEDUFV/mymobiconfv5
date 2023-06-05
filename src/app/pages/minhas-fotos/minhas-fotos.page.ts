import { UsuarioService } from './../../services/usuario.service';
import { Component, OnInit, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
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
  constructor(private albumService: AlbumService, private userService: UsuarioService,
    private sanitizer: DomSanitizer, private eventoService: EventoService) { }

  async ngOnInit() {
    await this.getAlbum();
  }

   async getAlbum(){

    this.userId = this.userService.getID();
    this.eventoId = this.eventoService.getID();
    this.album = this.albumService.getAlbum();
    this.getImages();

  }

  getImages(){
    this.albumService.getImagesByUsrId(this.userId, this.album.idAlbum as string).subscribe((images: any[]) => {

      this.images = images;
      console.log('image1: ', images)
    });
  }

  sanitizeImage(imageData: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(imageData);
  }

  sanitizeImageUrl(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  startUpload(file:LocalFile){

  }
  deleteImage(file:LocalFile){

  }
  selectImage(){

  }
}
