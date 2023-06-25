import { Action } from 'ngssm-store';
import { NgssmVisibilityActionType } from './ngssm-visibility-action-type';

export class HideElementAction implements Action {
  public readonly type: string = NgssmVisibilityActionType.hideElement;

  constructor(public readonly elementKey: string) {}
}
