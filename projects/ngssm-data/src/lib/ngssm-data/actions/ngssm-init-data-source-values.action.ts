import { Action } from 'ngssm-store';
import { NgssmDataActionType } from './ngssm-data-action-type';

export class NgssmInitDataSourceValuesAction implements Action {
  public readonly type: string = NgssmDataActionType.initDataSourceValues;

  constructor(public readonly keys: string[]) {}
}
