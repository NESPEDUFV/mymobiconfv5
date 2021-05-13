import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { UsuarioService } from '../../services/usuario.service';
import { OverlayService } from '../../services/overlay.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  /** Formulário do login */
  loginForm: FormGroup;
  /** Registra a ação do botão de voltar */
  private botaoBack: Function;
  /** Controla se o usuário pode sair da página (vale sempre `false` enquanto não estiver logado) */
  private leaveCheck: boolean = false;
  /**
   * Cria os campos do formulário e configura o e-mail como obrigatório
   * @param platform Usado para registrar uma ação do botão de voltar (Android)
   * @param formBuilder Usado para criar o formulário de login
   * @param overlay
   * @param usuario
   */
   constructor(

    private formBuilder: FormBuilder,
    private platform: Platform,
    private router: Router,
    private overlay: OverlayService,
    private usuario: UsuarioService


    ) {
     this.loginForm = this.formBuilder.group({
      email: ['', Validators.email]
     });



}

ngOnInit() {
}
  /**
   * Ao entrar na página, impede o usuário de voltar uma página
   */
  ionViewWillEnter() {
    this.leaveCheck = false;
  }

  /**
  * Ao sair da página, desfaz o registro de ação do botão de voltar
  */
   ionViewWillLeave() {
    this.botaoBack();
  }

  /**
   * Verifica se pode sair da página
   */
  ionViewCanLeave(): boolean {
      return this.leaveCheck;
  }


loginEmail(email){
    //this.usuario.loginEmail(email);
   //this.overlay.createLoading("Verificando usuário..." );
   // avisoLoading.present();
   //this.overlay.showAlert("Falha no login", "usuario inexistente.","OK")


     //Aviso de loading, é exibido até que se tenha obtido resposta do servidor,
        //ou se tenha excedido o tempo limite de resposta

        this.usuario.loginEmail(email, () => {
         // let avisoLoading = this.overlay.createLoading("Verificando usuário...");
          //Trecho para ativar o tutorial assim que o login for efetuado
          //o "this.navCtrl.remove(loginIndex);" serve para quando o o usuário sair do tutorial,
          //fazer com que a página de login não seja mais exibida
          this.leaveCheck = true;
          this.overlay.dismissAllLoaders();

          this.router.navigate(['my-mobi-conf']);//volta pra página inicial "para frente"
      }, () => {
        this.overlay.dismissAllLoaders();
          this.overlay.createAlert(
              "Falha no login",
              "Usuário inexistente.",
              'OK'
          );
      }, () => {
          this.overlay.dismissAllLoaders();
          this.overlay.createAlert(
              "Falha na conexão",
              "Não foi possível se conectar. Verifique sua conexão e tente novamente.",
              "OK"
          )
      });

      }

  irParaSignup(){
    this.router.navigate(['signup']);
  }


}
