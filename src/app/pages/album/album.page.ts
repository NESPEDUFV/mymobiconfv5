import { AlbumEventoPage } from './../album-evento/album-evento.page';
import { Router } from '@angular/router';
import { FotosPage } from './../fotos/fotos.page';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-album',
  templateUrl: './album.page.html',
  styleUrls: ['./album.page.scss'],
})
export class AlbumPage implements OnInit {

  botoes: { id: string, label: string, pagina: any }[] = [
    { id: "camera", label: "Particpe do álbum", pagina: FotosPage },
    { id: "visualizar-album", label: "Visualizar Álbum", pagina: AlbumEventoPage }
  ];
  constructor(private router: Router) { }

  ngOnInit() {
  }

  acessarPagina(pagina){


    if(pagina==FotosPage){
      this.router.navigate(['fotos'])
    }else{
      this.router.navigate(['album-evento']);
    }

  }


}
