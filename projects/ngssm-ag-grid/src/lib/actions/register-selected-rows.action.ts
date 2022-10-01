import { Action } from 'ngssm-store';
import { ChangeOrigin } from '../state';
import { AgGridActionType } from './ag-grid-action-type';

export class RegisterSelectedRowsAction implements Action {
  public readonly type: string = AgGridActionType.registerSelectedRows;

  constructor(public readonly gridId: string, public readonly origin: ChangeOrigin, public readonly ids: string[]) {}
}
