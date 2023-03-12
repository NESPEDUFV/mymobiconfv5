import { ServidorService } from './../servidor/servidor.service';
import { ArmazenamentoService } from './../armazenamento.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameRankingService {

  constructor(private storage: ArmazenamentoService, private servidor: ServidorService) { }


  listarGrupos(idEvento: number, tipo:number, okCb: (grupos:any) => void, erroCb: () => void, erroConexaoCb: () => void) {
    this.servidor.game_ranking.rankearGrupos(idEvento, tipo).subscribe((val: any) => {
        //--console.log("recebeu" + JSON.stringify(val));
        if (val.success == 1) {
            //--console.log("grupos: " + val.grupos);

            okCb(val.grupos);
        } else {
            //--console.log("ERRo grupos");
            erroCb();
        }

    }, () => {
        erroConexaoCb();

    });
}

listarAtividades(idEvento: number, tipo:number, okCb: (atividades:any) => void, erroCb: () => void, erroConexaoCb: () => void) {
    this.servidor.game_ranking.rankearAtividade(idEvento, tipo).subscribe((val: any) => {
        //--console.log("recebeu" + JSON.stringify(val));
        if (val.success == 1) {
            //--console.log("atividades: " + val.atividades);

            okCb(val.atividades);
        } else {
            //--console.log("ERRo atividades");
            erroCb();
        }

    }, () => {
        erroConexaoCb();

    });
}

listarUsuarios(idEvento: number, tipo:number, okCb: (usuarios:any) => void, erroCb: () => void, erroConexaoCb: () => void) {
    this.servidor.game_ranking.rankearParticipantes(idEvento, tipo).subscribe((val: any) => {
        //--console.log("recebeu" + JSON.stringify(val));
        if (val.success == 1) {
            //--console.log("participantes: " + val.usuarios);

            okCb(val.usuarios);
        } else {
            //--console.log("ERRo participantes");
            erroCb();
        }

    }, () => {
        erroConexaoCb();

    });
}

listarUsuariosEncerrado(idEvento: number,  okCb: (usuarios:any) => void, erroCb: () => void, erroConexaoCb: () => void) {
    this.servidor.game_ranking.rankearParticipantesEncerrado(idEvento).subscribe((val: any) => {
        //console.log("recebeu" + JSON.stringify(val));
        if (val.success == 1) {
            //console.log("participantes: " + val.ranking);

            okCb(val.ranking);
        } else {
            //console.log("ERRo participantes");
            erroCb();
        }

    }, () => {
        erroConexaoCb();

    });

}

}
