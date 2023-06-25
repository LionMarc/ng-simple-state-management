import { Action } from 'ngssm-store';
import { NgssmVisibilityActionType } from './ngssm-visibility-action-type';

export class DefineElementsGroupAction implements Action {
  public readonly type: string = NgssmVisibilityActionType.defineElementsGroup;

  constructor(public readonly elementKeys: string[]) {}
}
