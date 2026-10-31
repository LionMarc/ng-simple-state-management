import { Action, ReducerFunc } from 'ngssm-store';

import { NgssmDataActionType } from '../actions/ngssm-data-action-type';
import { updateNgssmDataState } from '../state';

export class NgssmUnregisterDataSourceAction implements Action {
  public readonly type: string = NgssmDataActionType.unregisterDataSource;

  constructor(public readonly dataSourceKey: string) {}
}

export const unregisterDataSource: ReducerFunc<NgssmUnregisterDataSourceAction> = (state, action) =>
  updateNgssmDataState(state, {
    dataSourceValues: { $unset: [action.dataSourceKey] },
    dataSources: { $unset: [action.dataSourceKey] }
  });
