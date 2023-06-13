import { NavigationExtras, Router } from '@angular/router';
import { OverlayService } from './../../../services/overlay.service';
import { UsuarioService } from './../../../services/usuario.service';
import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  /**Formulário de cadastro */
  signupForm: FormGroup;
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

    this.signupForm = formBuilder.group({
      nome: ['', Validators.required],
      email: ['', Validators.email]
  });
   }

   /**
     * Chamada quando se clica no botão de criar nova conta. Se a nova conta tiver sido criada com sucesso, imediatamente faz o login usando a função passada como parâmetro para a página
     */
    signup() {
      //Aviso de loading, é exibido até que se tenha obtido resposta do servidor,
      //ou se tenha excedido o tempo limite de resposta
    //  let avisoLoading = this.overlay.createLoading("Verificando e-mail..." );
     //Não apaga loading igual o login
     this.overlay.dismissAllLoaders();

      this.usuario.signup(this.signupForm.value.nome, this.signupForm.value.email, () => {
        this.overlay.dismissAllLoaders();
          this.overlay.createAlert(
              "Cadastro completo",
              "Usuário cadastrado com sucesso!",
              'OK'
          );

          /**navParams não existe mais, assim os dados serão enviados para proxima pagina
           * Usando QueryParams do router do Angular
           * referência : https://ionicacademy.com/pass-data-angular-router-ionic-4/
           */
          let navigationExtras: NavigationExtras = {
            queryParams: {
              special: JSON.stringify(this.signupForm.value.email)
            }
          }
          this.router.navigate(['my-mobi-conf'],navigationExtras)

      }), () => {
          this.overlay.dismissAllLoaders();
          this.overlay.createAlert(
              "E-mail já cadastrado",
              "Este e-mail já foi cadastrado. Por favor, use outro endereço de e-mail.",
              'OK'
          )
      }, () => {
        this.overlay.dismissAllLoaders();
        this.overlay.createAlert(
              "Falha na conexão",
              "Não foi possível se conectar. Verifique sua conexão e tente novamente.",
              'OK'
          );
      };

  }
  ngOnInit() {
  }

}
