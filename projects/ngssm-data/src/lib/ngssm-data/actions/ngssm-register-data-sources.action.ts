import { Action } from 'ngssm-store';

import { NgssmDataActionType } from './ngssm-data-action-type';
import { NgssmDataSource } from '../model';

export class NgssmRegisterDataSourcesAction implements Action {
  public readonly type: string = NgssmDataActionType.registerDataSources;

  constructor(public readonly dataSources: NgssmDataSource[]) {}
}
