import { WritableSignal, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Action, ActionDispatcher, State } from 'ngssm-store';

export class StoreMock implements ActionDispatcher {
  public readonly state$: BehaviorSubject<State>;
  public readonly state: WritableSignal<State>;
  public logsEnabled = false;
  public processedAction = signal<Action>({ type: '' });

  private _stateValue: State = {};

  constructor(initialState: State) {
    this.state$ = new BehaviorSubject<State>(this._stateValue);
    this.state = signal<State>(this._stateValue);
    this.stateValue = initialState;
  }

  public get stateValue(): State {
    return this._stateValue;
  }

  public set stateValue(value: State) {
    this._stateValue = value;
    this.state$.next(value);
    this.state.set(value);
  }

  public dispatchAction(action: Action): void {
    if (this.logsEnabled) {
      console.log('[StoreMock - dispatchAction]', action);
    }
  }

  public dispatchActionType(type: string): void {
    if (this.logsEnabled) {
      console.log('[StoreMock - dispatchActionType]', type);
    }
  }
}
