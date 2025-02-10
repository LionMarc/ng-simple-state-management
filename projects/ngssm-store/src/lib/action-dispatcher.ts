import { Action } from './action';

export interface ActionDispatcher {
  dispatchAction(action: Action): void;

  dispatchActionType(type: string): void;
}
