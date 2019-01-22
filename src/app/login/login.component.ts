import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginUrl: string;

  constructor(
    private _auth: AuthService
  ) { }

  ngOnInit() {
    this.loginUrl = this._auth.loginUrl;
  }

}
