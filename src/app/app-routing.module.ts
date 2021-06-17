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
    path: 'my-mobi-conf',
    loadChildren: () => import('./pages/my-mobi-conf/my-mobi-conf/my-mobi-conf.module').then( m => m.MyMobiConfPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'eventos',
    loadChildren: () => import('./pages/eventos/eventos.module').then( m => m.EventosPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
