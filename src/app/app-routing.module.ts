import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'eventos',
    loadChildren: () => import('./pages/eventos/eventos.module').then( m => m.EventosPageModule)
  },
  {
    path: 'my-mobi-conf',
    loadChildren: () => import('./pages/my-mobi-conf/my-mobi-conf.module').then( m => m.MyMobiConfPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup/signup.module').then( m => m.SignupPageModule)
  },

  {
    path: 'eventos-info',
    loadChildren: () => import('./pages/evento-info/evento-info.module').then( m => m.EventoInfoPageModule)
  },
  {
    path: 'evento-inscricao',
    loadChildren: () => import('./pages/evento-inscricao/evento-inscricao.module').then( m => m.EventoInscricaoPageModule)
  },
  {
    path: 'atividades',
    loadChildren: () => import('./pages/atividades/atividades.module').then( m => m.AtividadesPageModule)
  },
  {
    path: 'questionarios',
    loadChildren: () => import('./pages/questionarios/questionarios.module').then( m => m.QuestionariosPageModule)
  },
  {
    path: 'opinar',
    loadChildren: () => import('./pages/opinar/opinar.module').then( m => m.OpinarPageModule)
  },
  {
    path: 'parceiros',
    loadChildren: () => import('./pages/parceiros/parceiros.module').then( m => m.ParceirosPageModule)
  },
  {
    path: 'noticias',
    loadChildren: () => import('./pages/noticias/noticias.module').then( m => m.NoticiasPageModule)
  },
  {
    path: 'social',
    loadChildren: () => import('./pages/social/social.module').then( m => m.SocialPageModule)
  },
  {
    path: 'salas-off-topic',
    loadChildren: () => import('./pages/salas-off-topic/salas-off-topic.module').then( m => m.SalasOffTopicPageModule)
  },
  {
    path: 'opcoes-enviar-perguntas',
    loadChildren: () => import('./pages/opcoes-enviar-perguntas/opcoes-enviar-perguntas.module').then( m => m.OpcoesEnviarPerguntasPageModule)
  },
  {
    path: 'ranking-perguntas',
    loadChildren: () => import('./pages/ranking-perguntas/ranking-perguntas.module').then( m => m.RankingPerguntasPageModule)
  },
  {
    path: 'enviar-pergunta',
    loadChildren: () => import('./pages/enviar-pergunta/enviar-pergunta.module').then( m => m.EnviarPerguntaPageModule)
  },
  {
    path: 'noticia',
    loadChildren: () => import('./pages/noticia/noticia.module').then( m => m.NoticiaPageModule)
  },
  {
    path: 'questionario',
    loadChildren: () => import('./pages/questionario/questionario.module').then( m => m.QuestionarioPageModule)
  },
  {
    path: 'questionarios',
    loadChildren: () => import('./pages/questionarios/questionarios.module').then( m => m.QuestionariosPageModule)
  },
  {
    path: 'sobre',
    loadChildren: () => import('./pages/sobre/sobre.module').then( m => m.SobrePageModule)
  },
  {
    path: 'config',
    loadChildren: () => import('./pages/config/config.module').then( m => m.ConfigPageModule)
  },

  {
    path: 'atividade-info',
    loadChildren: () => import('./pages/atividade-info/atividade-info.module').then( m => m.AtividadeInfoPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
