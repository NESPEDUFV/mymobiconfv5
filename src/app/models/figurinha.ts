export interface Figurinha {
  ID_IMAGEM: string;
  FOTO: Blob;
  ID_PARTICIPANTE: string;
  ID_ATIVIDADE_REFERENTE?: number; //foto pode não estar vinculada a atividade
  DATETIME: string;
  PONTOS: number;
  ID_ALBUM: string;
  SUBMETIDA?: number;
  PUBLICADA?:number;
  STATUS?:number;
  PUBLICADA_INTERMEDIARIA?:number;
}
