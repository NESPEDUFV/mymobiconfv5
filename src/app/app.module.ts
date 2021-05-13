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


@NgModule({
  declarations: [
    AppComponent,

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
