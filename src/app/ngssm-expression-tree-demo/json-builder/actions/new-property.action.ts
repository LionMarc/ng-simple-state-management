import { Action } from 'ngssm-store';
import { JsonBuilderActionType } from './json-builder-action-type';

export class NewPropertyAction implements Action {
  public readonly type: string = JsonBuilderActionType.newProperty;

  constructor(
    public readonly treeId: string,
    public readonly parentNodeId?: string
  ) {}
}
