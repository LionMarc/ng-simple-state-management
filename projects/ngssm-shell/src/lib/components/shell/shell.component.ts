import { Component, ChangeDetectionStrategy, Input, HostBinding } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { NgSsmComponent, Store } from 'ngssm-store';

import { ShellConfig } from '../../model';

@Component({
  selector: 'ngssm-shell',
  templateUrl: './shell.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShellComponent extends NgSsmComponent {
  private readonly _shellConfig$ = new BehaviorSubject<ShellConfig | undefined>(undefined);

  @HostBinding('class') class = 'ngssm-shell';

  constructor(store: Store) {
    super(store);
  }

  @Input() public set shellConfig(value: ShellConfig) {
    this._shellConfig$.next(value);
  }

  public get shellConfig$(): Observable<ShellConfig | undefined> {
    return this._shellConfig$.asObservable();
  }
}
