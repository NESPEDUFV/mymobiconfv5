import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import { AtividadesService } from 'src/app/services/atividades.service';
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
  idAtividade: number;
  selectedAtividade: number;
  imagesLoaded = 0;
  showSticker: boolean = false;
  constructor(
    public atividadeService: AtividadesService,
    public eventoService: EventoService,
    private albumService: AlbumService
  ) {}

  ngOnInit() {
    this.imagesLoaded = 0;
    this.atividadeService
      .getAtividadesEvento(this.eventoService.getID())
      .pipe(
        tap((resp) => {
          console.log('atividades: ', resp);
          this.atividades = resp;
        })
      )
      .subscribe();

  }

  ngAfterViewInit() {
    console.log('selectedImage first value: ', this.selectedImage);
    // this.drawSticker();
  }


  isWeb() {
    if (Capacitor.getPlatform() == 'web') {
      return true;
    }
    return false;
  }

  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      height: 400,
      width: 400,
      promptLabelHeader: 'Escolha como participar',
      promptLabelPhoto: 'Escolher uma imagem da galeria',
      promptLabelPicture: 'Tirar uma foto',
      source: CameraSource.Prompt,
      resultType: this.isWeb()
        ? CameraResultType.DataUrl
        : CameraResultType.Uri, //mudar para base643 quando for salvar no banco
    });
    this.selectedImage = image;
    this.copyImageToCanvas()

    if (this.isWeb()) {
      this.selectedImage.webPath = image.dataUrl;
    }
  }


  copyImageToCanvas() {
    var canvas = document.querySelector("canvas");
    // Limpa o canvas definindo o innerHTML como uma string vazia
canvas.innerHTML = '';
    var ctx = canvas.getContext("2d");

    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Aplica a cor de preenchimento
    ctx.fillStyle = "#A4B3D7";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    console.log('copy to canvas', canvas);

    var img1 = new Image();
    img1.src = '../../../assets/img/logo-mymobiconf.png';
    var img2 = new Image();
    img2.src = this.selectedImage.dataUrl;

    this.imagesLoaded += 1;
    this.showSticker = true;

    img2.onload = function(){
      var img2Width = canvas.width - 80; // Subtracting the double border width
      var img2Height = canvas.height - 80; // Subtracting the double border width
      var img2X = 40; // Left border width
      var img2Y = 40; // Top border width

      ctx.drawImage(img2, img2X, img2Y, img2Width, img2Height);
    }

    img1.onload = function(){
      // Draw img1 at the bottom-right of the canvas
      var img1Width = 90;
      var img1Height = (img1.height / img1.width) * img1Width;
      var img1X = canvas.width - img1Width;
      var img1Y = canvas.height - img1Height;

      ctx.drawImage(img1, img1X, img1Y, img1Width, img1Height);
    };
  }



  // copyImageToCanvas() {
  //   // Cria o primeiro canvas para a imagem selecionada
  //   var canvas1 = document.createElement("canvas");
  //   var ctx1 = canvas1.getContext("2d");

  //   // Cria o segundo canvas para o logo-mymobiconf
  //   var canvas2 = document.createElement("canvas");
  //   var ctx2 = canvas2.getContext("2d");

  //   // Define as dimensões dos canvas
  //   var canvasWidth = 400;
  //   var canvasHeight = 500;
  //   canvas1.width = canvasWidth;
  //   canvas1.height = canvasHeight;
  //   canvas2.width = canvasWidth;
  //   canvas2.height = canvasHeight;

  //   // Carrega a imagem selecionada
  //   var imgSelected = new Image();
  //   imgSelected.src = this.selectedImage.dataUrl;

  //   // Carrega o logo-mymobiconf
  //   var imgLogo = new Image();
  //   imgLogo.src = "../../../assets/img/logo-mymobiconf.png";

  //   var self = this;

  //   imgSelected.onload = function() {
  //     // Desenha a imagem selecionada no primeiro canvas
  //     ctx1.drawImage(imgSelected, 0, 0, canvasWidth, canvasHeight);

  //     imgLogo.onload = function() {
  //       // Desenha o logo-mymobiconf no segundo canvas

  //       var img1Width = 90;
  //       var img1Height = (imgLogo.height / imgLogo.width) * img1Width;
  //       var img1X = canvasWidth - img1Width;
  //       var img1Y = canvasHeight - img1Height;
  //       console.log('variaveis',img1X, img1Y, img1Width, img1Height);
  //       //ctx.drawImage(img1, img1X, img1Y, img1Width, img1Height);
  //       ctx2.drawImage(imgLogo, img1X, img1Y, canvasWidth, canvasHeight);

  //       // Cria um elemento div para sobrepor os dois canvas
  //       var wrapperDiv = document.createElement("div");
  //       wrapperDiv.style.position = "relative";

  //       // Define a posição absoluta dos canvas
  //       canvas1.style.position = "absolute";
  //       canvas2.style.position = "absolute";

  //       // Define as coordenadas para sobrepor o canvas com o logo-mymobiconf acima
  //       canvas2.style.zIndex = "1";
  //       canvas2.style.top = "0";
  //       canvas2.style.left = "0";

  //       // Adiciona os canvas à div
  //       wrapperDiv.appendChild(canvas1);
  //       wrapperDiv.appendChild(canvas2);

  //       // Adiciona a div ao documento
  //       var container = document.getElementById("canvas-container");
  //       container.innerHTML = "";
  //       container.appendChild(wrapperDiv);

  //       self.showSticker = true;
  //     };
  //   };
  // }


  async shareOeganization() {
    this.albumService.postImagem(
      this.selectedImage.webPath,
      this.selectedAtividade
    );
  }


   loadImage(src, onload) {
    // http://www.thefutureoftheweb.com/blog/image-onload-isnt-being-called
    var img = new Image();

    img.onload = onload;
    img.src = src;

    return img;
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

  // drawSticker() {
  //   console.log('chamolui')
  //   const canvas = document.getElementById('sticker') as HTMLCanvasElement;
  //   console.log('canvas', canvas);

  //   const context = canvas.getContext('2d');
  //   console.log('canvas', canvas);
  //   // Desenhar o retângulo
  //   context.fillStyle = '#A4B3D7';
  //   context.fillRect(0, 0, 965.3, 1196.19);

  //   // Adicionar o texto
  //   context.font = '70px Roboto';
  //   context.fillStyle = 'white';
  //   context.fillText('myMobiConf', 0, 144);

  //   // Adicionar a imagem
  //   const logo = new Image();
  //   logo.src = '../../../assets/img/logo-mymobiconf.png';
  //   logo.onload = function () {
  //     const x = canvas.width - 50 - 412; // Posição x do círculo
  //     const y = 50; // Posição y do círculo
  //     const radius = 206; // Raio do círculo
  //     context.save();
  //     context.beginPath();
  //     context.arc(x + radius, y + radius, radius, 0, Math.PI * 2, false);
  //     context.closePath();
  //     context.clip();
  //     context.drawImage(logo, x, y, 2 * radius, 2 * radius);
  //     context.restore();
  //   };
  // }
  /*
shareInstagram(){
  console.log('click');
  this.instagram.share( this.getBase64Image(this.selectedImage), 'Caption')
    .then(() => console.log('Shared!'))
    .catch((error: any) => console.error(error));
}
*/
}
