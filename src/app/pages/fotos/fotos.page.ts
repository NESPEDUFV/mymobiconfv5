import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { AtividadesService } from 'src/app/services/atividades.service';
import { EventoService } from 'src/app/services/evento.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-fotos',
  templateUrl: './fotos.page.html',
  styleUrls: ['./fotos.page.scss'],
})
export class FotosPage implements OnInit {
  atividades: any;
  photoForm: FormGroup;
  selectedImage: any;
  constructor(public atividadeService: AtividadesService, public eventoService: EventoService, fb: FormBuilder) { }

  ngOnInit() {
    this.atividadeService.getAtividadesEvento(this.eventoService.getID()).pipe(
      tap(resp => {
        console.log('atividades: ', resp);
        this.atividades = resp;
      })
    ).subscribe();

    this.photoForm = new FormGroup({
      photo: new FormControl(''),
      idAtividade: new FormControl('')
    })
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
      promptLabelPhoto:'Escolher uma imagem da galeria',
      promptLabelPicture: 'Tirar uma foto',
      source: CameraSource.Prompt,
      resultType: this.isWeb() ? CameraResultType.DataUrl:  CameraResultType.Uri //mudar para base643 quando for salvar no banco
    });
    this.selectedImage = image;
    if(this.isWeb()){
      this.selectedImage.webPath = image.dataUrl;
    }
    console.log('fotooooo: ', image)
  }


}
