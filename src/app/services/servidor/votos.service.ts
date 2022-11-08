import { HttpClient } from '@angular/common/http';

/**
 * Conexões com o servidor relacionadas às perguntas
 */
export class ServVotos {
    /**
     * @param http Usado para fazer os requests HTTP
     * @param url URL do servidor
     */
    constructor(private http: HttpClient, private url: string) { }


    /**
     * Envia uma pergunta sobre um evento
     * @param pergID id da pergunta
     * @param usuarioID ID do usuário enviando a pergunta
     */
    enviarVoto(pergID: string, usuarioID: string){
        return this.http.post(this.url + "/App/enviaVoto.php", {
            ID_PERGUNTA: pergID,
            ID_PARTICIPANTE: usuarioID
        });
    }
}
