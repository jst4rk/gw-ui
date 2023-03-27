import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  navigation = [
    'gateways',
    'devices'
  ];

  activatedRoute!: BehaviorSubject<string>;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(map(result => result.matches), shareReplay());

  constructor(
    private breakpointObserver: BreakpointObserver,
    private _route: ActivatedRoute,
    private _router: Router,
    private _location: Location
  ) { }

  get activatedRoute$ () {
    return this.activatedRoute.asObservable();
  }

  ngOnInit(): void {
    this.activatedRoute = new BehaviorSubject(this._location.path().replace('/', ''));
    this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Do something when the route changes
        this.activatedRoute.next(event.url.replace('/', ''));
      }
    });
  }
}
