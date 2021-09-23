import { NoticiaInterface } from './../../services/noticia.service';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-noticia',
  templateUrl: './noticia.page.html',
  styleUrls: ['./noticia.page.scss'],
})
export class NoticiaPage implements OnInit {
    /** Dados da notícia */
    noticia: NoticiaInterface = {
      ID: "",
      titulo: "-",
      corpo: "...",
      hora: null
  };

  constructor(private router: Router,private route: ActivatedRoute,) {

  }

  /**
     * Ao entrar na página, carrega os dados da notícia passados como parâmetro
     */
   ionViewWillEnter() {
    this.route.queryParams.subscribe(params => {

      if(this.router.getCurrentNavigation().extras.state){
        console.log("has extras");
        this.noticia = this.router.getCurrentNavigation().extras.state.noticia;
      }
    })
}

  ngOnInit() {
  }




}
