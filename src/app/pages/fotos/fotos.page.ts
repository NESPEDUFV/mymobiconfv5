import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import {  AtividadesService } from 'src/app/services/atividades.service';
import { EventoService } from 'src/app/services/evento.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { AlbumService } from 'src/app/services/album.service';

@Component({
  selector: 'app-fotos',
  templateUrl: './fotos.page.html',
  styleUrls: ['./fotos.page.scss'],
})
export class FotosPage implements OnInit {
  atividades: any;
  selectedImage: any = {};
  idAtividade:number;
  selectedAtividade: number;
  constructor(public atividadeService: AtividadesService,
    public eventoService: EventoService,
   private albumService: AlbumService,


   ) { }

  ngOnInit() {
    this.atividadeService.getAtividadesEvento(this.eventoService.getID()).pipe(
      tap(resp => {
        console.log('atividades: ', resp);
        this.atividades = resp;
      })
    ).subscribe();

  }

  isWeb(){
    if(Capacitor.getPlatform() == 'web'){
      return true;
    }
    return false;
  }

  async takePhoto(){
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      width: 600,
      promptLabelHeader: 'Escolha como participar',
      promptLabelPhoto:'Escolher uma imagem da galeria',
      promptLabelPicture: 'Tirar uma foto',
      source: CameraSource.Prompt,
      resultType: this.isWeb() ? CameraResultType.DataUrl:  CameraResultType.Uri //mudar para base643 quando for salvar no banco
    });
    this.selectedImage = image;

    if(this.isWeb()){
      this.selectedImage.webPath = image.dataUrl;
    }

  }

  async shareOeganization(){

    this.albumService.postImagem(this.selectedImage.webPath,this.selectedAtividade);
  }

  getBase64Image(img) {
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const dataURL = canvas.toDataURL('image/png');
    return dataURL;
  }
/*
shareInstagram(){
  console.log('click');
  this.instagram.share( this.getBase64Image(this.selectedImage), 'Caption')
    .then(() => console.log('Shared!'))
    .catch((error: any) => console.error(error));
}
*/
}
