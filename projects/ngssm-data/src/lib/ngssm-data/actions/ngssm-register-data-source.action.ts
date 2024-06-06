import { Action } from 'ngssm-store';

import { NgssmDataActionType } from './ngssm-data-action-type';
import { NgssmDataSource } from '../model';

export class NgssmRegisterDataSourceAction implements Action {
  public readonly type: string = NgssmDataActionType.registerDataSource;

  constructor(public readonly dataSource: NgssmDataSource) {}
}
