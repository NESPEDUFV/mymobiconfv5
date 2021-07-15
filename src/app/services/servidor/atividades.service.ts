import { TipoNota } from './../../enums/tipo-nota.enum';
import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServAtividades {
/**
     * @param http Usado para fazer os requests HTTP
     * @param url URL do servidor
     */
 constructor(private http: HttpClient,  @Inject(String) private url: string) { }

 /**
  * Busca a lista de atividades de um evento
  * @param eventoID ID do evento cujas atividades serão buscadas
  */
 buscar(eventoID: string) {
     return this.http.post(this.url + "/App/listaAtividades.php", { ID_EVENTO: eventoID });
 }

 /**
  * Envia uma nota, de um dado tipo, referente a uma atividade
  * @param tipoNota Tipo da nota
  * @param eventoID ID do evento à qual pertence a atividade avaliada
  * @param ativID ID da atividade avaliada
  * @param usuarioID ID do usuário que está avaliando
  * @param nota Valor da nota
  */
 enviarNota(tipoNota: TipoNota, eventoID: string, ativID: string, usuarioID: string, nota: number) {
     let script: string[] = [
         "/App/enviaConfortoTermicoAtividade.php",
         "/App/enviaConfortoSonoroAtividade.php",
         "/App/enviaQualidadeAudioAtividade.php",
         "/App/enviaQualidadeVideoAtividade.php",
         "/App/enviaNotaAtividade.php"
     ];
     return this.http.post(this.url + script[tipoNota], {
         ID_EVENTO: eventoID,
         ID_ATIVIDADE: ativID,
         ID_PARTICIPANTE: usuarioID,
         NOTA: nota
     });
 }
}
