import { Component, ChangeDetectionStrategy, Input, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { BehaviorSubject, Observable } from 'rxjs';

import { NgSsmComponent, Store } from 'ngssm-store';

import { SidenavConfig } from '../../model';
import { WrapperComponent } from '../wrapper/wrapper.component';

@Component({
    selector: 'ngssm-side-nav',
    imports: [CommonModule, MatDividerModule, RouterModule, WrapperComponent],
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
