import { HttpClient } from '@angular/common/http';

/**
 * Conexões com o servidor relacionadas às perguntas
 */
export class ServPerguntas {
    /**
     * @param http Usado para fazer os requests HTTP
     * @param url URL do servidor
     */
    constructor(private http: HttpClient, private url: string) { }

    /**
     * Busca a lista de perguntas
     * @param eventoID ID do evento cujos perguntas serão buscados
     */
    buscar(eventoID: string, usuarioID: string, atividadeID?: string) {
        if(atividadeID){
            return this.http.post(this.url + "/App/listaPerguntas.php", {
                ID_EVENTO: eventoID,
                ID_PARTICIPANTE: usuarioID,
                ID_ATIVIDADE: atividadeID
            });
        }else{
            return this.http.post(this.url + "/App/listaPerguntas.php", {
                ID_EVENTO: eventoID,
                ID_PARTICIPANTE: usuarioID
            });
        }

    }

    /**
     * Envia uma pergunta sobre um evento
     * @param pergunta Texto da pergunta
     * @param usuarioID ID do usuário enviando a pergunta
     * @param eventoID ID do evento sobre o qual está opinando
     * @param ativID ID da atividade sobre a qual está opinando
     */
    enviar(pergunta: string, usuarioID: string, eventoID: string, ativId?: string) {
        if(ativId){
            return this.http.post(this.url + "/App/enviaPergunta.php", {
                PERGUNTA: pergunta,
                ID_PARTICIPANTE: usuarioID,
                ID_EVENTO: eventoID,
                ID_ATIVIDADE: ativId
            });
        }else{
            return this.http.post(this.url + "/App/enviaPergunta.php", {
                PERGUNTA: pergunta,
                ID_PARTICIPANTE: usuarioID,
                ID_EVENTO: eventoID
            });
        }

    }
}
