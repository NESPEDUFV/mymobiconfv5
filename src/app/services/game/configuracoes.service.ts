import { EventoService } from './../evento.service';
import { ServidorService } from './../servidor/servidor.service';
import { ArmazenamentoService } from './../armazenamento.service';
import { Injectable } from '@angular/core';


export interface GameConfiguracoesInterface {
  idEvento: number
  pontosTermico: number
  pontosSonoro: number
  pontosAvaliacao: number
  pontosCompleto: number
  pontosQuestionario: number
  pontosDiamante: number
  pA_opiniao: number
  pB_opiniao: number
  qtdAtividades: number
  qtdQuestionarios: number
  ptsNivel2: number
  ptsNivel3: number
  ptsNivel4: number
  ptsNivel5: number
  ptsNivel6: number
  ptsNivel7: number
  ptsNivel8: number
  ptsNivel9: number
  ptsNivel10: number
  qtdMaxOpiniaoGanha: number
  qtdOpiniaoPerde: number
  status: number
  escondeuRanking: string
}


export interface GameHashtagInterface {
  nome: string
  hashtag: string

}
@Injectable({
  providedIn: 'root'
})

export class ConfiguracoesService {

  private dados: GameConfiguracoesInterface;
  private hashtags: GameHashtagInterface[];

  constructor(private storage: ArmazenamentoService, private servidor: ServidorService, private evento: EventoService) { }

   //Gets e sets
   getIdEvento(): number {
    if(this.dados == null || this.dados == undefined){
        this.carregarConfiguracoes(()=>{
            return this.dados.idEvento;
        },()=>{});
    }else{
        return this.dados.idEvento;
    }
}


getPontosTermico(): number {
  if(this.dados == null || this.dados == undefined){
      this.carregarConfiguracoes(()=>{
          return this.dados.pontosTermico;
      },()=>{});
  }else{
      return this.dados.pontosTermico;
  }
}

getPontosSonoro(): number {
  if(this.dados == null || this.dados == undefined){
      this.carregarConfiguracoes(()=>{
          return this.dados.pontosSonoro;
      },()=>{});
  }else{
      return this.dados.pontosSonoro;
  }
}

getPontosAvaliacao(): number {
  if(this.dados == null || this.dados == undefined){
      this.carregarConfiguracoes(()=>{
          return this.dados.pontosAvaliacao;
      },()=>{});
  }else{
      return this.dados.pontosAvaliacao;
  }
}

getPontosCompleto(): number {
  if(this.dados == null || this.dados == undefined){
      this.carregarConfiguracoes(()=>{
          return this.dados.pontosCompleto;
      },()=>{});
  }else{
      return this.dados.pontosCompleto;
  }
}

getPontosQuestionario(): number {
  if(this.dados == null || this.dados == undefined){
      this.carregarConfiguracoes(()=>{
          return this.dados.pontosQuestionario;
      },()=>{});
  }else{
      return this.dados.pontosQuestionario;
  }
}

getPontosDiamante(): number {
  if(this.dados == null || this.dados == undefined){
      this.carregarConfiguracoes(()=>{
          return this.dados.pontosDiamante;
      },()=>{});
  }else{
      return this.dados.pontosDiamante;
  }
}

getPA_opiniao(): number {
  if(this.dados == null || this.dados == undefined){
      this.carregarConfiguracoes(()=>{
          return this.dados.pA_opiniao;
      },()=>{});
  }else{
      return this.dados.pA_opiniao;
  }
}

getPB_opiniao(): number {
  if(this.dados == null || this.dados == undefined){
      this.carregarConfiguracoes(()=>{
          return this.dados.pB_opiniao;
      },()=>{});
  }else{
      return this.dados.pB_opiniao;
  }
}

getQtdAtividades(): number {
  if(this.dados == null || this.dados == undefined){
      this.carregarConfiguracoes(()=>{
          return this.dados.qtdAtividades;
      },()=>{});
  }else{
      return this.dados.qtdAtividades;
  }
}

getQtdQuestionarios(): number {
  if(this.dados == null || this.dados == undefined){
      this.carregarConfiguracoes(()=>{
          return this.dados.qtdQuestionarios;
      },()=>{});
  }else{
      return this.dados.qtdQuestionarios;
  }
}

getPtsNivel2(): number {
  return this.dados.ptsNivel2;
}

getPtsNivel3(): number {
  return this.dados.ptsNivel3;
}

getPtsNivel4(): number {
  return this.dados.ptsNivel4;
}

getPtsNivel5(): number {
  return this.dados.ptsNivel5;
}

getPtsNivel6(): number {
  return this.dados.ptsNivel6;
}

getPtsNivel7(): number {
  return this.dados.ptsNivel7;
}

getPtsNivel8(): number {
  return this.dados.ptsNivel8;
}

getPtsNivel9(): number {
  return this.dados.ptsNivel9;
}

getPtsNivel10(): number {
  return this.dados.ptsNivel10;
}

getQtdMaxOpiniaoGanha(): number {
  return this.dados.qtdMaxOpiniaoGanha;
}

getQtdOpiniaoPerde(): number {
  return this.dados.qtdOpiniaoPerde;
}

getStatus(): number {
  return this.dados.status;
}

getEscondeuRanking(): string {
  return this.dados.escondeuRanking;
}

calculaPtsOpiniao(qtdOpiniao: number): number {
  return Number(((10.0-Math.sqrt(this.getPA_opiniao()*qtdOpiniao))*(Math.sqrt(this.getPB_opiniao()*qtdOpiniao))).toFixed(2));
}

getHashtags(cb?: (a:GameHashtagInterface[]) => void): GameHashtagInterface[] {
  if(cb) cb(this.hashtags);
  return this.hashtags;
}

  /**
     * @return Se há dados no evento
     */
   existeDados(): any {
    return this.dados != null && this.dados != undefined;
    /*this.carregaInterno(()=>{
        //--console.log("Dados: " + JSON.stringify(this.dados));
        return this.dados != null && this.dados != undefined;
    },()=>{
        return false;
    });*/
}

existeDadosHashtag(): any {
    return this.hashtags != null && this.hashtags != undefined;
    /*this.carregaHashtag(()=>{
        //--console.log("Dados: " + JSON.stringify(this.hashtags));
        return this.hashtags != null && this.hashtags != undefined;
    },()=>{
        return false;
    });*/
}

/**
 * Carrega os dados do evento salvos no armazenamento local
 * @param cb (opcional) Callback para ser executada quando termina de carregar
 */

carregar(cb?: () => void) {
    this.storage.get('game_configuracoes').then((val) => {
        ////--console.log("Carregou:" + val);
        this.dados = JSON.parse(val);
        if (cb) cb();
    }, () => {
        this.dados = null;
    });
}

carregaHashtag(cbOk?: () => void, cbErro?: () => void){
  this.storage.get('game_configuracoes_hashtag').then((val) => {
      //--console.log("Carregou:" + val);
      this.hashtags = JSON.parse(val);
      if (cbOk) cbOk();
  }, () => {
      if (cbErro) cbErro();
      //this.dados = null;
  });
}



 /**
     * Salva os dados do evento passado no armazenamento local
     * @param evento Dados do evento
     */
  salvar() {
    //--console.log("SALVANDO:"+JSON.stringify(this.dados));
    this.storage.set('game_configuracoes', JSON.stringify(this.dados));
}

salvarHahshtag() {
  //--console.log("SALVANDO:"+JSON.stringify(this.hashtags));
  this.storage.set('game_configuracoes_hashtag', JSON.stringify(this.hashtags));
}

carregarConfiguracoes(okCb: () => void, erroCb: () => void) {
  this.evento.carregar(()=>{
  this.servidor.game_configuracao.carregarConfiguracoes(this.evento.getID()).subscribe((val: any) => {
      if (val.success == 1) { //cadastrado com sucesso
          this.dados = val.configuracoes;
          this.salvar();
          okCb();
      } else {

          erroCb();
      }

  }, () => {
      erroCb();

  });
  });
}

buscarHashtags(okCb: (hashtags:any[]) => void, erroCb: () => void) {
  this.evento.carregar(()=>{

  this.servidor.game_configuracao.carregarHashtags(this.evento.getID()).subscribe((val: any) => {
      if (val.success == 1) { //cadastrado com sucesso
          this.hashtags = val.hashtag;
          this.salvarHahshtag();
          okCb(val.hashtag);
      } else {

          erroCb();
      }

  }, () => {
      erroCb();

  });
  });
}

    /**
     * Apaga os dados do evento salvo
     */
     apagar() {
      this.dados = null;
      this.storage.set('game_configuracoes', null);
      this.hashtags = null;
      this.storage.set('game_configuracoes_hashtag', null);
  }





}
