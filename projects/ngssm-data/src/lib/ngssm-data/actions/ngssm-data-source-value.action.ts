import { Action } from 'ngssm-store';

export class NgssmDataSourceValueAction implements Action {
  constructor(
    public readonly type: string,
    public readonly key: string
  ) {}
}
