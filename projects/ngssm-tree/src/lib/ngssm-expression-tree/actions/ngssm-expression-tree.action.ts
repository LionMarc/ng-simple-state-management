import { Action } from 'ngssm-store';

export class NgssmExpressionTreeAction implements Action {
  constructor(
    public readonly type: string,
    public readonly treeId: string
  ) {}
}
