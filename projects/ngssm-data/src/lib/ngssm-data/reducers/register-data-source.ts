import { Action, ReducerFunc } from 'ngssm-store';

import { NgssmDataActionType } from '../actions/ngssm-data-action-type';
import { NgssmDataSource } from '../model';
import { registerDataSources } from './register-data-sources';

export class NgssmRegisterDataSourceAction implements Action {
  public readonly type: string = NgssmDataActionType.registerDataSource;

  constructor(public readonly dataSource: NgssmDataSource) {}
}

export const registerDataSource: ReducerFunc<NgssmRegisterDataSourceAction> = (state, action) =>
  registerDataSources(state, { dataSources: [action.dataSource], type: NgssmDataActionType.registerDataSources });
