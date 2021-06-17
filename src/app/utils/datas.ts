/**
 * Reúne funções de formatação/conversão de datas para strings
 */
 export class DatasUtil {
  /** Nomes dos meses */
  static readonly meses: string[] = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro"
  ];

  /** Margem de erro para o horário de início e fim de intervalos. 5 min = 5 x 60 s = 5 x 60 x 1000 ms */
  static readonly MargemErroTempo = 300000;

  /**
   * @param data Objeto Date
   * @returns Formato: DD de (nome do mês) de AAAA
   */
  static completa(data: Date): string {
      return data.getDate() + " de " + DatasUtil.meses[data.getMonth()].toLowerCase() + " de " + data.getFullYear();
  }

  /**
   * @param data Objeto Date
   * @returns Formato: DD (abreviação do mês) AAAA
   */
  static compacta(data: Date, mostrarAno?: boolean): string {
      return data.getDate() + " " + DatasUtil.meses[data.getMonth()].substr(0, 3) + ((mostrarAno) ? " " + data.getFullYear() : "");
  }

  /**
   * @param data Objeto Date
   * @returns Formato: HHhMM
   */
  static hora(data: Date): string {
      return data.getHours() + "h" + ("0" + data.getMinutes()).slice(-2);
  }

  /**
   * Verifica se o horário atual está dentro de um intervalo de tempo, ou se está após um horário inicial
   * @param horaInicio Horário inicial do intervalo
   * @param horaFim Horário final do intervalo
   * @returns Se a hora atual está dentro do intervalo
   */
  static estaNaHora(horaInicio: Date, horaFim?: Date): boolean {
      let agora: number = Date.now();
      if (horaFim)
          return (agora >= horaInicio.getTime() - DatasUtil.MargemErroTempo
              && agora <= horaFim.getTime() + DatasUtil.MargemErroTempo);
      else
          return (agora >= horaInicio.getTime() - DatasUtil.MargemErroTempo);
  }
}
