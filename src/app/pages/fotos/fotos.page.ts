import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { AtividadesService } from 'src/app/services/atividades.service';
import { EventoService } from 'src/app/services/evento.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { AlbumService, UserPhoto } from 'src/app/services/album.service';
import { Instagram } from '@awesome-cordova-plugins/instagram/ngx';

@Component({
  selector: 'app-fotos',
  templateUrl: './fotos.page.html',
  styleUrls: ['./fotos.page.scss'],
})
export class FotosPage implements OnInit {
  atividades: any;
  selectedImage: any = {};
  idAtividade: number;
  selectedAtividade: number;
  showSticker: boolean = false;
  public photos: UserPhoto[] = [];
  constructor(
    public atividadeService: AtividadesService,
    public eventoService: EventoService,
    private albumService: AlbumService,
    public instagram: Instagram,

  ) {}

  ngOnInit() {

    this.atividadeService
      .getAtividadesEvento(this.eventoService.getID())
      .pipe(
        tap((resp) => {

          this.atividades = resp;

        })
      )
      .subscribe();

     var teste =  this.albumService.getAlbum();
     console.log('teste',teste)


  }



  isWeb() {
    if (Capacitor.getPlatform() == 'web') {
      return true;
    }
    return false;
  }

  async takePhoto() {
    this.loadFirstImage();
    const image = await Camera.getPhoto({
      quality: 100,
      allowEditing: false,
      width:358,
      height: 440,
      promptLabelHeader: 'Escolha como participar',
      promptLabelPhoto: 'Escolher uma imagem da galeria',
      promptLabelPicture: 'Tirar uma foto',
      source: CameraSource.Prompt,
      resultType: this.isWeb()
        ? CameraResultType.DataUrl
        : CameraResultType.Uri, //mudar para base643 quando for salvar no banco
    });
    this.selectedImage = image;
    console.log('select dataurl: ', this.selectedImage.web)
    this.copyImageToCanvas()


      this.selectedImage.webPath = image.dataUrl;

  }


  copyImageToCanvas() {
    var canvas = document.querySelector("canvas");
    var ctx = canvas.getContext("2d");
    var img2 = new Image();

    console.log('this.selectedImage.webpath', this.selectedImage);
    img2.src = this.selectedImage.webPath ? this.selectedImage.webPath : this.selectedImage.dataUrl;
    this.showSticker = true;

    var img1 = new Image();
    img1.src = '../../../assets/img/moldura.png';

    // img1.onload = function() {
    //   // Draw img1 at the bottom-right of the canvas
    //   var img1Width = 380;
    //   var img1Height = 570;
    //   var img1X = canvas.width - img1Width;
    //   var img1Y = canvas.height - img1Height;

    //   ctx.drawImage(img1, 0, 0, img1Width, img1Height);
    // };

    img2.onload = function() {
      var img2Width = 358; // Largura do canvas
      var img2Height = 440; // Altura do canvas
      var img2X = (canvas.width - img2Width) / 2; // Centralizado horizontalmente
      var img2Y = 99; // 99px do topo do canvas

      ctx.drawImage(img2, img2X, img2Y, img2Width, img2Height);
    };
  }

  loadFirstImage(){
    var canvas = document.querySelector("canvas");
    var ctx = canvas.getContext("2d");
    var img1 = new Image();
    img1.src = '../../../assets/img/moldura.png';
    img1.onload = function(){
      // Draw img1 at the bottom-right of the canvas
      var img1Width = 380;
      var img1Height = 570;
      var img1X = canvas.width - img1Width;
      var img1Y = canvas.height - img1Height;

      ctx.drawImage(img1, 0, 0, img1Width, img1Height);
    };
  }


  async shareOrganization() {
    const image  = this.convertCanvasToImage();
    this.albumService.postImagem(image.src, this.selectedAtividade);
  }

  convertCanvasToImage() {
    let canvas = document.querySelector("canvas");
    let image = new Image();
    image.src = canvas.toDataURL();
    return image;
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


shareInstagram(){
  console.log('click');

  this.instagram.share( (this.convertCanvasToImage().src), 'Caption')
    //mostrar snackbar de erro
    .catch((error: any) => console.error(error));
}

}
