import { NotasService } from './../../services/notas.service';
import { TipoNota } from '../../enums/tipo-nota.enum';

/**
 * Gerencia o envio atrasado de notas, de forma que o usuário pode mudar sua avaliação muitas
 * vezes dentro de um intervalo de tempo mas o app só vai enviar a última nota colocada.
 */
export class EnvioNotas {
    /** Quantidade de atraso de tempo (ms) para esperar uma nova entrada */
    static readonly Atraso = 1000;
    /** Quantas entradas foram registradas dentro de um intervalo de tempo */
    private qtInput: number = 0;

    /**
     *
     * @param ativID ID da atividade à qual o envio de notas se destina
     * @param eventoID ID do evento da atividade à qual o envio de notas se destina
     * @param usuarioID ID do usuário que está enviando a nota
     * @param horaInicio Hora de início da atividade à qual o envio de notas se destina
     * @param horaFim Hora de fim da atividade à qual o envio de notas se destina
     * @param notas Provider das notas
     * @param tipo Tipo da nota a ser enviada
     * @param sucessoCb Callback de sucesso ao enviar
     * @param falhaCb Callback de falha no envio
     */
    constructor(
        private ativID: string,
        private eventoID: string,
        private usuarioID: string,
        private horaInicio: Date,
        private horaFim: Date,
        private notas: NotasService,
        private tipo: TipoNota,
        private sucessoCb?: () => void,
        private falhaCb?: () => void
    ) { }

    /**
     * Registra uma entrada do usuário e envia a nota se não houver novas entradas
     * @param nota Valor da nota
     */
    input(nota: number) {
        this.qtInput++;
        setTimeout(() => {
            this.qtInput--;
            if (this.qtInput == 0)
                this.notas.enviar(this.eventoID, this.ativID, this.usuarioID, this.tipo, nota,
                    this.horaInicio, this.horaFim, this.sucessoCb, this.falhaCb);
        }, EnvioNotas.Atraso);
    }
}
