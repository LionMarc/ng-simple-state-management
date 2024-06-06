import { Action } from 'ngssm-store';
import { NgssmDataActionType } from './ngssm-data-action-type';

export class NgssmUnregisterDataSourceAction implements Action {
  public readonly type: string = NgssmDataActionType.unregisterDataSource;

  constructor(public readonly dataSourceKey: string) {}
}
