import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicStorageModule } from '@ionic/storage-angular';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { LoginPage } from './pages/login/login.page';
import { UsuarioService } from './services/usuario.service';
import { ServidorService } from './services/servidor/servidor.service';
import { OverlayService } from './services/overlay.service';
import { ArmazenamentoService } from './services/armazenamento.service';

//Firebase para login com facebook
import firebase from 'firebase/app';
import { DatasPipe } from './pipes/datas.pipe';
/*
firebase.initializeApp({
  apiKey: "AIzaSyAkHLLB16yu5m5zE8qnGZLeQS0XD63DT7A",
  authDomain: "mymobiconf-3.firebaseapp.com",
  databaseURL: "https://mymobiconf-3.firebaseio.com",
  projectId: "mymobiconf-3",
  storageBucket: "mymobiconf-3.appspot.com",
  messagingSenderId: "445932221604"
})
*/

//Teste com outro projeto mymobiconf

firebase.initializeApp({
  apiKey: "AIzaSyAmsfAFa2HQXuBUEWg5ZVmJPpGoSHqpJm8",
  authDomain: "testeloginfbmmbc.firebaseapp.com",
  projectId: "testeloginfbmmbc",
  storageBucket: "testeloginfbmmbc.appspot.com",
  messagingSenderId: "510883437950",
  appId: "1:510883437950:web:8cc51634d0aa6a185b272f"

})



@NgModule({
  declarations: [
    AppComponent,
    DatasPipe,

  ],
  entryComponents: [

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    IonicStorageModule.forRoot(),
    HttpClientModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    HttpClientModule,
    ArmazenamentoService,
    UsuarioService,
    OverlayService,
    ServidorService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
