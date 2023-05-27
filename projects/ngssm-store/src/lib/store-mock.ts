import { signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Action } from './action';
import { State } from './state';

export class StoreMock {
  public state$ = new BehaviorSubject<{ [key: string]: any }>({});
  public state = signal<State>({});

  constructor(initialState: { [key: string]: any }) {
    this.state$.next(initialState);
  }

  public dispatchAction(action: Action): void {}

  public dispatchActionType(type: string): void {}
}
