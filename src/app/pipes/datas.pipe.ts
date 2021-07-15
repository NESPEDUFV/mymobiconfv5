import { Pipe, PipeTransform } from '@angular/core';
import { DatasUtil } from '../utils/datas';

/**
 * Transforma objetos Date em formatos específicos, com ajuda do `DatasUtil`
 */
@Pipe({
    name: 'datas',
})
export class DatasPipe implements PipeTransform {
    /**
     * Transforma de formas variadas um objeto Date
     * @param data Objeto Date a ser transformado
     * @param args Opções da transformação. Os possíveis valores são: `'completa'`, `'compacta'`, `'horario'`, `'hora'` e `'minuto'`
     */
    transform(data: Date, args: { tipo: string, mostrarAno?: boolean }) {
        if (!data)
            return "-";
        switch (args.tipo) {
            case 'completa':
                return DatasUtil.completa(data);
            case 'compacta':
                return DatasUtil.compacta(data, args.mostrarAno);
            case 'horario':
                return DatasUtil.hora(data);
            case 'hora':
                return data.getHours() + "h";
            case 'minuto':
                return ("0" + data.getMinutes()).slice(-2);
            default:
                return "-";
        }
    }
}

