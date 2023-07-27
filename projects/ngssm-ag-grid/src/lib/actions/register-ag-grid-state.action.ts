import { ColumnState } from 'ag-grid-community';

import { Action } from 'ngssm-store';

import { ChangeOrigin } from '../state';
import { AgGridActionType } from './ag-grid-action-type';

export class RegisterAgGridStateAction implements Action {
  public readonly type: string = AgGridActionType.registerAgGridState;

  constructor(
    public readonly gridId: string,
    public readonly origin: ChangeOrigin,
    public readonly columnStates: ColumnState[]
  ) {}
}
