import { Action } from 'ngssm-store';

import { NgssmDataActionType } from './ngssm-data-action-type';
import { NgssmDataSource } from '../model';

export class NgssmInitDataSourceValuesAction implements Action {
  public readonly type: string = NgssmDataActionType.initDataSourceValues;

  constructor(public readonly dataSources: NgssmDataSource[]) {}
}
