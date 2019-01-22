import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as md5 from 'md5';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _uri = 'https://accounts.spotify.com/authorize';
  private _client_id = '7565cbdc2f3f497489b9c7703247b3fb';
  private _redirect_uri = encodeURIComponent(`${environment.host}/callback`);
  private _scope = 'streaming%20user-read-birthdate%20user-read-email%20user-read-private';
  private _response_type = 'token';

  constructor(
    private _http: HttpClient
  ) { }

  get loginUrl() {
    const state = md5(navigator.userAgent);
    localStorage.setItem('state', state);
    return `${this._uri}` +
      `?client_id=${this._client_id}` +
      `&redirect_uri=${this._redirect_uri}` +
      `&scope=${this._scope}` +
      `&response_type=${this._response_type}` +
      `&state=${state}`;
  }
}
