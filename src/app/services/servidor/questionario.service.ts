import { HttpClient } from '@angular/common/http';

/**
 * Conexões com o servidor relacionadas aos questionários
 */
export class ServQuestionarios {
    /**
     * @param http Usado para fazer os requests HTTP
     * @param url URL do servidor
     */
    constructor(private http: HttpClient, private url: string) { }

    /**
     * Busca a lista de quesitonários
     * @param eventoID ID do evento cujos questionários serão buscados
     * @param usuarioID ID do usuário
     */
    buscar(eventoID: string, usuarioID: string) {
        return this.http.post(this.url + "/App/listaQuestionarios.php", {
            ID_EVENTO: eventoID,
            ID_PARTICIPANTE: usuarioID
        });
    }

    /**
     * Busca quais respostas já foram enviadas
     * @param perguntasIDs IDs das perguntas cujas respostas serão buscadas
     * @param usuarioID ID do usuário
     */
    buscarRespostas(perguntasIDs: string[], usuarioID: string) {
        return this.http.post(this.url + "/App/listaRespostasQuestionario.php", {
            ID_PERGUNTA: perguntasIDs,
            ID_PARTICIPANTE: usuarioID
        });
    }

    /**
     * Busca quais questionários já foram liberados
     * @param atividadesIDs IDs das atividades
     */
    buscarLiberados(atividadesIDs: string[]) {
        return this.http.post(this.url + "/App/listaAtividadesID.php", {
            IDS_ATIVIDADES: atividadesIDs
        });
    }

    /**
     * Envia respostas de um questionário
     * @param perguntasIDs IDs das perguntas
     * @param respostasIDs IDs das respostas
     * @param usuarioID ID do usuário que está respondendo
     * @param eventoID ID do evento
     */
    enviarResposta(perguntasIDs: string[], respostasIDs: string[], usuarioID: string, eventoID: string) {
        return this.http.post(this.url + "/App/enviaQuestionario.php", {
            ID_PERGUNTAS: perguntasIDs,
            ID_RESPOSTAS: respostasIDs,
            ID_PARTICIPANTE: usuarioID,
            ID_EVENTO: eventoID
        });
    }
}
