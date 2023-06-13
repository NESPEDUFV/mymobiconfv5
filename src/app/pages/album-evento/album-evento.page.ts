import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AlbumService } from 'src/app/services/album.service';
import { EventoService } from 'src/app/services/evento.service';
import { ServidorService } from 'src/app/services/servidor/servidor.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-album-evento',
  templateUrl: './album-evento.page.html',
  styleUrls: ['./album-evento.page.scss'],
})
export class AlbumEventoPage implements OnInit {

  images:  any[]= [];
  album;
  constructor(private albumService: AlbumService, private router: Router,
    private route: ActivatedRoute,private userService: UsuarioService,
    private sanitizer: DomSanitizer,private activatedRoute: ActivatedRoute, private eventoService: EventoService, private servidor:ServidorService) {

     }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {

      if(this.router.getCurrentNavigation().extras.state){
        console.log("has extras");
        this.album = this.router.getCurrentNavigation().extras.state.album;
      }
    });

    this.albumService.getAllAbumFotos(this.album.idAlbum).subscribe((resp: any[]) => {
      this.images = resp;
      console.log('images lenght', this.images.length)
    })


  }

}
