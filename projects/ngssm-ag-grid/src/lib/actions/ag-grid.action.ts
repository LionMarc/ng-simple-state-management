import { Action } from 'ngssm-store';

export class AgGridAction implements Action {
  constructor(
    public readonly type: string,
    public readonly gridId: string
  ) {}
}
