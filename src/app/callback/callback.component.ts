import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { map } from 'rxjs/operators';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit {

  constructor(
    private _route: ActivatedRoute,
    private _router: Router
  ) {
    // const url: Observable<string> = _route.url.map(segments => segments.join(''));
  }

  ngOnInit() {
    const fragment = this._route.snapshot.fragment;
    const fragments: any = fragment.split('&').reduce(function (result, item) {
      const parts = item.split('=');
      result[parts[0]] = parts[1];
      return result;
    }, {});
    localStorage.removeItem('state');
    Object.keys(fragments).forEach((key) => {
      if (key !== 'state') {
        localStorage.setItem(key, fragments[key]);
      }
    });
    this._router.navigate(['/']);
  }

}
