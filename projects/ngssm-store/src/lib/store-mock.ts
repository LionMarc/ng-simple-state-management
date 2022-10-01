import { BehaviorSubject } from 'rxjs';
import { Action } from './action';

export class StoreMock {
  public state$ = new BehaviorSubject<{ [key: string]: any }>({});

  constructor(initialState: { [key: string]: any }) {
    this.state$.next(initialState);
  }

  public dispatchAction(action: Action): void {}

  public dispatchActionType(type: string): void {}
}
