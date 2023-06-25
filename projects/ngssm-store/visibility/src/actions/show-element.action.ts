import { Action } from 'ngssm-store';
import { NgssmVisibilityActionType } from './ngssm-visibility-action-type';

export class ShowElementAction implements Action {
  public readonly type: string = NgssmVisibilityActionType.showElement;

  constructor(public readonly elementKey: string) {}
}
