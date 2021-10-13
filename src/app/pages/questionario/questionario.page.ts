import { ToastController, IonContent, NavController } from '@ionic/angular';
import { OverlayService } from './../../services/overlay.service';
import { UsuarioService } from './../../services/usuario.service';
import { EventoService } from 'src/app/services/evento.service';
import { Component, ViewChild, OnInit } from '@angular/core';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { QuestionarioService, QuestionarioInterface, PerguntaInterface } from '../../services/questionario.service';

@Component({
  selector: 'app-questionario',
  templateUrl: './questionario.page.html',
  styleUrls: ['./questionario.page.scss'],
})
export class QuestionarioPage implements OnInit {

  /** `ion-content` da página */
  @ViewChild(IonContent) content: IonContent;
  /** Questionário passado como parâmetro para a página */
  questionario: QuestionarioInterface;
  /** Lista de perguntas do questionário */
  perguntas: PerguntaInterface[] = [];
  /** Respostas marcadas para cada pergunta */
  respostas: {
      [IDPergunta: string]: string;
  } = {};

  /** Se todas as perguntas foram respondidas */
  tudoRespondido: boolean = false;
  /** Informa se o aviso de "Questionário ainda não enviado" está sendo exibido */
  avisoActive: boolean = false;
  /** Toast do aviso "Questionário ainda não enviado" */
  aviso = this.toastCtrl.create({
      message: "Questionário ainda não enviado",
      buttons: [
        {
          text: "OK",
          handler: () => {
            console.log('Close clicked');
          }
        }
      ]
  });



  /**
     * @param router Usado para fechar esta página
     * @param navParams Usado para adquirir os dados do questionário
     * @param toastCtrl
     * @param overlay
     * @param questionarios
     * @param evento Usado para adquirir o ID do evento
     * @param usuario Usado para adquirir o ID do usuário
     */
   constructor(
    private router: Router,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private overlay: OverlayService,
    private questionarios: QuestionarioService,
    private evento: EventoService,
    private usuario: UsuarioService,
    private route: ActivatedRoute
) {

  this.route.queryParams.subscribe(params => {

    if(this.router.getCurrentNavigation().extras.state){
      console.log("has extras");
      this.questionario = this.router.getCurrentNavigation().extras.state.eventoEscolhido;
      this.perguntas = this.questionario.perguntas;
      this.respostas = this.questionarios.getRespostas(this.questionario.ID);
      this.checkTudoRespondido();
      if (!this.questionarios.foiEnviado(this.questionario.ID) && this.tudoRespondido && !this.avisoActive) {
          this.avisoActive = true;
      }
    }


  })
}


  ngOnInit() {
  }

    /**
     * Ao entrar na página, carrega os dados do questionário, chama o método `checkTudoRespondido` e atualiza o `aviso` de acordo
     */
     ionViewWillEnter() {

  }

  /**
   * Ao sair da página, fecha o aviso do questionário não enviado
   */
  ionViewWillLeave() {
      if (this.avisoActive) {
          //this.aviso.dismiss();
          this.avisoActive = false;
      }
  }

  /**
   * Envia as respostas do questionário, mostrando o aviso adequado
   */
  enviarRespostas() {
      if (this.tudoRespondido) {
          let loading = this.overlay.createLoading("Enviando respostas..." );

          this.questionarios.enviar(this.questionario.ID, this.usuario.getID(), this.evento.getID(), () => {
              this.overlay.dismissAllLoaders();
              if (this.avisoActive) {
                  this.overlay.dismissAllLoaders();
                  this.avisoActive = false;
              }
          });
          this.overlay.createAlert(
            "Questionário completo!",
            "Suas respostas foram enviadas com sucesso.",
            "OK"
          )
          this.navCtrl.back();
           () => {
            this.overlay.dismissAllLoaders();
            this.toastCtrl.create({
              message:  "Falha na conexão",
              buttons: [
                {
                  text: "OK",
                  handler: () => {
                    console.log('Close clicked');
                  }
                }
              ]
            });
              this.overlay.createAlert(
                 "Falha na conexão",
                 "Suas respostas serão salvas e enviadas automaticamente quando possível.",
                 "OK"
              ),
              async () => { if (!this.avisoActive) { (await this.aviso).present(); this.avisoActive = true; } }
          };
        }
       else {
          this.overlay.createAlert(
              "Pergunta não respondida",
             "Nem todas as perguntas foram respondidas. Por favor, responda a todas as perguntas.",
              'OK'
          );
      }
  }

  /**
   * Registra uma resposta ao questionário
   * @param perguntaID ID da pergunta que foi respondida
   */
 async responder(perguntaID: string) {
      if (this.questionarios.foiEnviado(this.questionario.ID) && !this.avisoActive) {
         (await this.aviso).present();
          this.avisoActive = true;
      }
      this.questionarios.responder(this.questionario.ID, perguntaID, this.respostas[perguntaID]);
      this.checkTudoRespondido();
  }

  /**
   * Atualiza a flag que indica se está tudo respondido ou não
   */
  checkTudoRespondido() {
      if (this.questionario)
          this.tudoRespondido = this.questionarios.getQtRespondidas(this.questionario.ID) == this.perguntas.length;
      else
          this.tudoRespondido = false;
  }
}
