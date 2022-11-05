import { TipoNota } from './../../enums/tipo-nota.enum';
import { Component, OnInit } from '@angular/core';
import { AtividadeInterface, AtividadesService } from 'src/app/services/atividades.service';
import { EnvioNotas } from './envio-notas';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { UsuarioService } from 'src/app/services/usuario.service';
import { EventoService } from 'src/app/services/evento.service';
import { ConfigService,Config } from 'src/app/services/config.service';
import { NotasService } from 'src/app/services/notas.service';
import { NotificacoesService } from 'src/app/services/notificacoes.service';
import { DatasUtil } from 'src/app/utils/datas';

@Component({
  selector: 'app-atividade-info',
  templateUrl: './atividade-info.page.html',
  styleUrls: ['./atividade-info.page.scss'],
})
export class AtividadeInfoPage implements OnInit {
     /** @ignore */
     tipoNota = TipoNota; // Disponibilizar enums para o template

     /** Evento o qual a atividade pertence, para verificar se é online ou presencial */
     isOnline: number;

     /** Atividade cujas informações serão exibidas */
     atividade: AtividadeInterface;
     /** Dia da atividade */
     dia: string = "-";
     /** Versão formatada da hora de início e de fim da atividade */
     horaFormatada = { inicio: "-", fim: "-" };

     /** Indica se a atividade já começou ou não */
     comecou: boolean;
     /** Indica se está dentro do intervalo de hora da atividade */
     estaNaHora: boolean;
     /** Indica se a atividade está na agenda */
     estaNaAgenda: boolean = false;

     /** Nota de avaliação do conforto térmico */
     avConfTermico: number;
     /** Nota de avaliação do conforto sonoro */
     avConfSonoro: number;
     /** Nota de avaliação da qualidade do áudio */
     avQualAudio: number;
     /** Nota de avaliação da qualidade do vídeo */
     avQualVideo: number;
     /** Nota de avaliação da atividade */
     avAtividade: number;

     /** Gerenciador de envio das notas do conforto térmico */
     private envioTerm: EnvioNotas;
     /** Gerenciador de envio das notas do conforto sonoro */
     private envioSom: EnvioNotas;
     /** Gerenciador de envio das notas da qualidade do vídeo */
     private envioVideo: EnvioNotas;
     /** Gerenciador de envio das notas da qualidade do som */
     private envioAudio: EnvioNotas;
     /** Gerenciador de envio das notas da atividade */
     private envioAtiv: EnvioNotas;

     /** Mensagens de cada nota para conforto térmico */
     msgConfTermico: string[] = [
         "Frio demais!", "Meio frio...", "Temperatura ideal!", "Meio quente...", "Quente demais!"
     ];
     /** Mensagens de cada nota para conforto sonoro */
     /** Mensagens de cada nota para conforto sonoro */
     msgConfSonoro: string[] = [
         "Baixo demais...", "Meio baixo...", "Som ideal!", "Meio alto...", "Alto demais!"
     ];
     /** Mensagens de cada nota para qualidade do áudio */
     msgQualAudio: string[] = [
         "Péssima", "Ruim", "Boa", "Ótima", "Excelente!"
     ];
     /** Mensagens de cada nota para qualidade do áudio */
     msgQualVideo: string[] = [
         "Péssima", "Ruim", "Boa", "Ótima", "Excelente!"
     ];

     /**
      * @param navParams Adquire os dados da atividade
      * @param toastCtrl Mostra toasts de aviso
      * @param usuario Usado para adquirir o ID do usuário
      * @param evento Usado para adquirir o ID do evento
      * @param config
      * @param atividades
      * @param notas
      * @param notif
      */
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastCtrl: ToastController,
    private usuario: UsuarioService,
    private evento: EventoService,
    private config: ConfigService,
    private atividades: AtividadesService,
    private notas: NotasService,
    private notif: NotificacoesService
  ) {
    this.route.queryParams.subscribe(params => {

      if(this.router.getCurrentNavigation().extras.state){
        console.log("has extras");
        this.atividade = this.router.getCurrentNavigation().extras.state.ativ;
      }
    })
  }

  ngOnInit() {
  }

      /**
     * Ao entrar na página, carrega os dados, marca informações - se já começou, se está dentro
     * do horário e se está agendada - e obtém as notas, tudo referente à atividade
     */
       ionViewWillEnter() {
        this.isOnline  = this.evento.getIsOnline();

        this.comecou = this.atividades.comecou(this.atividade.ID);
        this.estaNaHora = this.atividades.estaNaHora(this.atividade.ID);
        this.estaNaAgenda = this.atividades.estaNaAgenda(this.atividade.ID);

        this.dia = DatasUtil.completa(this.atividade.horaInicio);
        this.horaFormatada.inicio = DatasUtil.hora(this.atividade.horaInicio);
        this.horaFormatada.fim = DatasUtil.hora(this.atividade.horaFim);

        this.obterNotas();
        this.inicializarEnvios();
    }

     /**
     * Função do botão de adicionar à agenda
     */
      adicionarAgenda() {
        if (this.atividades.agendar(this.atividade.ID, this.config.get(Config.PermitirConflito)))
          this.presentToast("Atividade " + ((this.estaNaAgenda) ? ("removida da") : ("adicionada à")) + " agenda!",1500,'bottom');
        else
            this.presentToast("Você já possui atividades nesse horário!",1500,'bottom')

        this.estaNaAgenda = this.atividades.estaNaAgenda(this.atividade.ID);
        if (this.estaNaAgenda)
            this.notif.aoAgendar(this.atividade.ID, this.atividade.titulo, this.atividade.horaInicio, this.atividade.horaFim);
        else
            this.notif.aoTirarDaAgenda(this.atividade.ID);
    }

    //**função para toast */

    async presentToast(message,duration,position) {
      const toast = await this.toastCtrl.create({
        message: message,
        duration: duration,
        position: position,
      });
      await toast.present();
    }

    async presentToastNotas(message,duration,position) {
      const toast = await this.toastCtrl.create({
        message: message,
        duration: duration,
        position: position,
        buttons: [
          {
            text: "Ok",
            role: "cancel"
          }
        ]
      });
      await toast.present();
    }



    /**
     * Prepara os gerenciadores de envio de notas
     */
    inicializarEnvios() {
        let sucesso = () => {
          this.presentToastNotas("Nota enviada!",1500,'bottom');
        }
        let falha = () => {
            this.presentToastNotas("Sem conexão! D:",1500,'bottom');
        }

        this.envioTerm = new EnvioNotas(this.atividade.ID, this.evento.getID(), this.usuario.getID(),
            this.atividade.horaInicio, this.atividade.horaFim, this.notas, TipoNota.Term,
            () => sucesso(), () => falha());
        this.envioSom = new EnvioNotas(this.atividade.ID, this.evento.getID(), this.usuario.getID(),
            this.atividade.horaInicio, this.atividade.horaFim, this.notas, TipoNota.Som,
            () => sucesso(), () => falha());
        this.envioAudio = new EnvioNotas(this.atividade.ID, this.evento.getID(), this.usuario.getID(),
            this.atividade.horaInicio, this.atividade.horaFim, this.notas, TipoNota.Aud,
            () => sucesso(), () => falha());
        this.envioVideo = new EnvioNotas(this.atividade.ID, this.evento.getID(), this.usuario.getID(),
            this.atividade.horaInicio, this.atividade.horaFim, this.notas, TipoNota.Vid,
            () => sucesso(), () => falha());
        this.envioAtiv = new EnvioNotas(this.atividade.ID, this.evento.getID(), this.usuario.getID(),
            this.atividade.horaInicio, this.atividade.horaFim, this.notas, TipoNota.Ativ,
            () => sucesso(), () => falha());
    }



    /**
     * Lê as notas da atividade do armazenamento local
     */
    obterNotas() {
        this.notas.disponivel(() => {
            this.avConfTermico = this.notas.getNota(this.atividade.ID, TipoNota.Term) || 3;
            this.avConfSonoro = this.notas.getNota(this.atividade.ID, TipoNota.Som) || 3;
            this.avQualAudio = this.notas.getNota(this.atividade.ID, TipoNota.Aud) || 3;
            this.avQualVideo = this.notas.getNota(this.atividade.ID, TipoNota.Vid) || 3;
            this.avAtividade = this.notas.getNota(this.atividade.ID, TipoNota.Ativ) || 0;
        });
    }

    /**
     * Chamada sempre que a avaliação da atividade muda
     * @param nota Nota dada para a atividade
     */
    mudouAvAtiv(nota: number) {
        this.avAtividade = nota;
        this.envioAtiv.input(nota);
    }

    /**
     * Chamada sempre que a avaliação do conforto térmico ou sonoro muda
     * @param t Tipo da nota (conforto térmico ou sonoro)
     */
    mudouAvConf(t: TipoNota) {
        if (this.estaNaHora)
            if (t == TipoNota.Term)
                this.envioTerm.input(this.avConfTermico);
            else if (t == TipoNota.Som)
                this.envioSom.input(this.avConfSonoro);
            else if (t == TipoNota.Aud)
                this.envioAudio.input(this.avQualAudio);
            else if (t == TipoNota.Vid)
                this.envioVideo.input(this.avQualVideo);
    }


}
