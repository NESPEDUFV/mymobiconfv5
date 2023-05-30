import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { AtividadeInterface, AtividadesService } from 'src/app/services/atividades.service';
import { EventoService } from 'src/app/services/evento.service';


@Component({
  selector: 'app-fotos',
  templateUrl: './fotos.page.html',
  styleUrls: ['./fotos.page.scss'],
})
export class FotosPage implements OnInit {
  atividades: any;
  photoForm: FormGroup;
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

  onSelectChange(selected:any){
    console.log('selected: ', selected)
  }


}
