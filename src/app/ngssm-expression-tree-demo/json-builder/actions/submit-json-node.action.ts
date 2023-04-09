import { Action } from 'ngssm-store';
import { JsonBuilderActionType } from './json-builder-action-type';
import { JsonNodeType } from '../model';

export class SubmitJsonNodeAction implements Action {
  public readonly type: string = JsonBuilderActionType.submitJsonNode;

  constructor(public readonly jsonNodeType: JsonNodeType, public readonly name: string) {}
}
