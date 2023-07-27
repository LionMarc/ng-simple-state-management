import { Action } from 'ngssm-store';

export class TreeAction implements Action {
  constructor(
    public readonly type: string,
    public readonly treeId: string
  ) {}
}
