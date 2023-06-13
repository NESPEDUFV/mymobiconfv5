import { MinhasFotosPage } from './../minhas-fotos/minhas-fotos.page';
import { AlbumEventoPage } from './../album-evento/album-evento.page';
import { NavigationExtras, Router } from '@angular/router';
import { FotosPage } from './../fotos/fotos.page';
import { Component, OnInit } from '@angular/core';
import { ServidorService } from 'src/app/services/servidor/servidor.service';
import { AlbumService } from 'src/app/services/album.service';
import { EventoService } from 'src/app/services/evento.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-album',
  templateUrl: './album.page.html',
  styleUrls: ['./album.page.scss'],
})
export class AlbumPage implements OnInit {

  botoes: { id: string, label: string, pagina: any }[] = [
    { id: "camera", label: "Particpe do álbum", pagina: 'fotos' },
    { id: "visualizar-album", label: "Visualizar Álbum", pagina: 'album-evento' },

  ];
  album;
  constructor(private router: Router,private albumService: AlbumService,
    private sanitizer: DomSanitizer, private eventoService: EventoService, private servidor: ServidorService) { }

  ngOnInit() {
    this.servidor.album.getAlbumEventoId(this.eventoService.getID()).subscribe((resp) => {
      this.album = resp;
    });
  }

  acessarPagina(pagina: any) {
    if (pagina === 'album-evento') {
      const navigationExtras: NavigationExtras = {
        state: {
          album: this.album
        }
      };
      console.log('extras', navigationExtras);
      this.router.navigate([pagina], navigationExtras);
    } else {
      this.router.navigate([pagina]);
    }
  }



}
