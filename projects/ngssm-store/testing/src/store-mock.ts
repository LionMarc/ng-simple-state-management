import { signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Action, ActionDispatcher, State } from 'ngssm-store';

export class StoreMock implements ActionDispatcher{
  private _stateValue: State = {};
  public state$ = new BehaviorSubject<State>(this._stateValue);
  public state = signal<State>(this._stateValue);

  constructor(initialState: State) {
    this.stateValue = initialState;
  }

  public set stateValue(value: State) {
    this._stateValue = value;
    this.state$.next(value);
    this.state.set(value);
  }

  public get stateValue(): State {
    return this._stateValue;
  }

  public dispatchAction(action: Action): void {
    console.log('[StoreMock - dispatchAction]', action);
  }

  public dispatchActionType(type: string): void {
    console.log('[StoreMock - dispatchActionType]', type);
  }
}
