import { Component, NgZone, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import * as _ from 'lodash';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { Album, Track } from '../interfaces/track';

import { AuthService } from '../auth/auth.service';
import { StreamrService } from './streamr.service';

@Component({
  selector: 'app-streamr',
  templateUrl: './streamr.component.html',
  styleUrls: ['./streamr.component.scss']
})
export class StreamrComponent implements OnInit {
  track: Track = {
    artists: [],
    name: '',
    album: {
      name: '',
      image: '',
      dimensions: {
        height: 0,
        width: 0
      }
    }
  };
  isLoaded = false;
  results: any[] = [];
  queryField: FormControl = new FormControl();

  constructor(
    private _zone: NgZone,
    private _auth: AuthService,
    private _streamr: StreamrService
  ) { }

  ngOnInit() {
    this.queryField.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(query => this._streamr.search(query))
      )
      .subscribe(result => {
        const tracks = result.tracks.items;
        this.results = _.map(tracks, track => {
          console.log(track);
          const formatted_track: Track = {
            artists: _.map(track.album.artists, 'name'),
            name: track.name,
            uri: track.uri,
            album: {
              name: track.album.name,
              image: track.album.images[1].url,
              dimensions: {
                height: track.album.images[1].height,
                width: track.album.images[1].width
              }
            }
          };
          return formatted_track;
        });
      });
  }

  public play(spotify_uri: string): void {
    this._streamr.play(spotify_uri)
      .subscribe(
        data => {
          this._streamr.playerStateChanged.subscribe(state => {
            this.isLoaded = true;
            this._zone.run(() => this._playerStateChanged(state));
          });
        },
        error => console.error(error)
      );
  }

  private _playerStateChanged(state) {
    const current_track = state.track_window.current_track;
    const current_album = state.track_window.current_track.album;
    const album_image = current_album.images[0];
    this.track = {
      artists: _.map(current_track.artists, 'name'),
      name: current_track.name,
      album: {
        name: current_album.name,
        image: album_image.url,
        dimensions: {
          height: album_image.height,
          width: album_image.width
        }
      }
    };
  }
}
