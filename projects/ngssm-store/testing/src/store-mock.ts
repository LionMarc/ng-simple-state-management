import { WritableSignal, signal } from '@angular/core';

import { Action, ActionDispatcher, State } from 'ngssm-store';

export class StoreMock implements ActionDispatcher {
  public readonly state: WritableSignal<State>;
  public logsEnabled = false;
  public processedAction = signal<Action>({ type: '' });

  private _stateValue: State = {};

  constructor(initialState: State) {
    this.state = signal<State>(this._stateValue);
    this.stateValue = initialState;
  }

  public get stateValue(): State {
    return this._stateValue;
  }

  public set stateValue(value: State) {
    this._stateValue = value;
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
