import { Component, OnInit } from '@angular/core';
import { Platform,LoadingController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { UsuarioService } from '../../services/usuario.service';
import { OverlayService } from '../../services/overlay.service';
import { Router } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public loading2: any;
  public isGoogleLogin = false;
  public user = null;
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

    private google: GooglePlus,
    public loadingController: LoadingController,
    private fireAuth: AngularFireAuth,
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

async ngOnInit() {
  this.loading2 = await this.loadingController.create({
    message: 'Connecting ...'
  });
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
    //Aviso de loading, é exibido até que se tenha obtido resposta do servidor,
      //ou se tenha excedido o tempo limite de resposta
    //this.overlay.createLoading("Verificando usuário..." );
        this.usuario.loginEmail(email, () => {
         // let avisoLoading = this.overlay.createLoading("Verificando usuário...");
          //Trecho para ativar o tutorial assim que o login for efetuado
          //o "this.navCtrl.remove(loginIndex);" serve para quando o o usuário sair do tutorial,
          //fazer com que a página de login não seja mais exibida
          this.leaveCheck = true;
          this.overlay.dismissAllLoaders();

          this.router.navigate(['eventos']);//vai pra página inicial "para frente"
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

        /**
     * Faz o login via Facebook e vai para a `EventosPage` caso o login seja bem sucedido
     */
        /*
        //teste de background
        loginFB(){
          console.log("login\n");
        }
        */

    loginFB() {
      let avisoLoading = this.overlay.createLoading("Aguardando..." );
      //avisoLoading.present();
      console.log("login.page\n");
      this.usuario.loginFB(() => {
          this.overlay.dismissAllLoaders();
          this.leaveCheck = true;
          this.router.navigate(['eventos']);
      }, () => {
          this.overlay.dismissAllLoaders();
          this.overlay.createAlert(
              "Falha na conexão",
              "Não foi possível se conectar ao Facebook. Verifique sua conexão e tente novamente.",
              'OK'
          );
      });

  }

  GoogleLogin(){
    let params: any;
    if (this.platform.is('cordova')) {
      if (this.platform.is('android')) {
        params = {
          webClientId: '<WEB_CLIENT_ID>', //  webclientID 'string'
          offline: true
        };
      } else {
        params = {};
      }
      this.google.login(params)
      .then((response) => {
        const { idToken, accessToken } = response;
        this.onLoginSuccess(idToken, accessToken);
      }).catch((error) => {
        console.log(error);
        alert('error:' + JSON.stringify(error));
      });
    } else{
      console.log('else...');
      this.fireAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(success => {
        console.log('success in google login', success);
        this.isGoogleLogin = true;
        this.user =  success.user;
        this.router.navigate(['eventos']);
      }).catch(err => {
        console.log(err.message, 'error in google login');
      });
    }
  }

  onLoginSuccess(accessToken, accessSecret) {
    const credential = accessSecret ? firebase.auth.GoogleAuthProvider
        .credential(accessToken, accessSecret) : firebase.auth.GoogleAuthProvider
            .credential(accessToken);
    this.fireAuth.signInWithCredential(credential)
      .then((success) => {
        alert('successfully');
        this.isGoogleLogin = true;
        this.user =  success.user;
        this.loading2.dismiss();
      });

  }
  onLoginError(err) {
    console.log(err);
  }

  irParaSignup(){
    this.router.navigate(['signup']);
  }


}
