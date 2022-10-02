import { Component, ChangeDetectionStrategy, Input, HostBinding } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { NgSsmComponent, Store } from 'ngssm-store';

import { SidenavConfig } from '../../model';

@Component({
  selector: 'ngssm-side-nav',
  templateUrl: './side-nav.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideNavComponent extends NgSsmComponent {
  private readonly _sidenavConfig$ = new BehaviorSubject<SidenavConfig | undefined>(undefined);

  @HostBinding('class') class = 'ngssm-sidenav';

  constructor(store: Store) {
    super(store);
  }

  @Input() public set config(value: SidenavConfig | undefined) {
    this._sidenavConfig$.next(value);
  }

  public get sidenavConfig$(): Observable<SidenavConfig | undefined> {
    return this._sidenavConfig$.asObservable();
  }
}
