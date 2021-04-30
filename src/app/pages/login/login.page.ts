import { Component, OnInit } from '@angular/core';
import {NavController, Platform} from '@ionic/angular';
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
   * @param navCtrl Usado para mostrar a página de signup
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



 async loginEmail(email){
   // this.usuario.loginEmail(email);
   //this.overlay.createLoading("Verificando usuário..." );
   // avisoLoading.present();
   //this.overlay.showAlert("Falha no login", "usuario inexistente.","OK")


     //Aviso de loading, é exibido até que se tenha obtido resposta do servidor,
        //ou se tenha excedido o tempo limite de resposta
        let avisoLoading = this.overlay.createLoading("Verificando usuário...");
        this.usuario.loginEmail(email, () => {
          //Trecho para ativar o tutorial assim que o login for efetuado
          //o "this.navCtrl.remove(loginIndex);" serve para quando o o usuário sair do tutorial,
          //fazer com que a página de login não seja mais exibida
          this.leaveCheck = true;
          //avisoLoading.dismiss();

          this.router.navigate(['foward']);//volta pra página inicial "para frente"
      }, () => {
         // avisoLoading.dismiss();
          this.overlay.createAlert(
              "Falha no login",
              "Usuário inexistente.",
              'OK'
          );
      }, () => {
         // avisoLoading.dismiss();
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
