import { Action } from 'ngssm-store';
import { NgssmVisibilityActionType } from './ngssm-visibility-action-type';

export class ToggleElementVisibilityAction implements Action {
  public readonly type: string = NgssmVisibilityActionType.toggleElementVisibility;

  constructor(public readonly elementKey: string) {}
}
