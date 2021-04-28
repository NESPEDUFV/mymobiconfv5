import { Component, OnInit } from '@angular/core';
import {NavController, Platform} from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { UsuarioProvider } from '../../services/usuario.service';
import { OverlaysProvider } from '../../services/overlay.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }


}
