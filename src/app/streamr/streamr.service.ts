import { Injectable, NgZone } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { catchError } from 'rxjs/operators';
import { throwError, Observable, Subscriber } from 'rxjs';

import { Player } from '../interfaces/player';

@Injectable({
  providedIn: 'root'
})
export class StreamrService {
  public ready: Observable<any>;
  public playerReady: Observable<any>;
  public playerStateChanged: Observable<any>;

  private _readyObserver: Subscriber<any>;
  private _spotify: any;
  private _player: Player;
  private _access_token: string;
  private _searchUrl = 'https://api.spotify.com/v1/search?type=track&q=';

  constructor(
    private _http: HttpClient,
    private _zone: NgZone
  ) {
    this.ready = new Observable(observer => { this._readyObserver = observer; });
    this._access_token = localStorage.getItem('access_token');
    this._zone.runOutsideAngular(() => {
      (<any>window).onSpotifyWebPlaybackSDKReady = () => {
        this._zone.run(() => {
          this._spotify = (<any>window).Spotify;
          this._player = new this._spotify.Player({
            name: 'Streamr',
            getOAuthToken: cb => { cb(this._access_token); }
          });
          // Error handling
          this._player.addListener('initialization_error', ({ message }) => { console.error(message); });
          this._player.addListener('authentication_error', ({ message }) => { console.error(message); });
          this._player.addListener('account_error', ({ message }) => { console.error(message); });
          this._player.addListener('playback_error', ({ message }) => { console.error(message); });

          // Playback status updates
          this.playerStateChanged = new Observable(observer => {
            this._player.addListener('player_state_changed', state => {
              console.log(state);
              observer.next(state);
            });
          });

          // Ready
          this.playerReady = new Observable(observer => {
            this._player.addListener('ready', ({ device_id }) => {
              console.log('Ready with Device ID', device_id);
              observer.next(device_id);
            });
          });

          // Not Ready
          this._player.addListener('not_ready', ({ device_id }) => {
            console.log('Device ID has gone offline', device_id);
          });

          // Connect to the player!
          this._player.connect();
          this._readyObserver.next(true);
        });
      };
    });
  }

  public search(queryString: string): Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this._access_token}`
      })
    };

    return this._http.get(`${this._searchUrl}${queryString}`, httpOptions);
  }

  public play = (spotify_uri: string) => {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this._access_token}`
      })
    };

    return this._http.put(
      `https://api.spotify.com/v1/me/player/play?device_id=${this._player._options.id}`,
      { uris: [spotify_uri] },
      httpOptions
    ).pipe(
      catchError(this._handleError)
    );
  }

  private _handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}
