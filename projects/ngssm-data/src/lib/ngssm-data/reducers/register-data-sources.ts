import { Action, ReducerFunc } from 'ngssm-store';

import { NgssmDataActionType } from '../actions/ngssm-data-action-type';
import { NgssmDataSource, NgssmDataSourceValue, NgssmDataSourceValueStatus } from '../model';
import { selectNgssmDataState, updateNgssmDataState } from '../state';

export class NgssmRegisterDataSourcesAction implements Action {
  public readonly type: string = NgssmDataActionType.registerDataSources;

  constructor(public readonly dataSources: NgssmDataSource[]) {}
}

export const registerDataSources: ReducerFunc<NgssmRegisterDataSourcesAction> = (state, action) => {
  const dataSourceValues: Record<string, NgssmDataSourceValue> = {};
  const dataSources: Record<string, NgssmDataSource> = {};

  action.dataSources.forEach((dataSource) => {
    if (selectNgssmDataState(state).dataSources[dataSource.key]) {
      return;
    }

    dataSourceValues[dataSource.key] = {
      status: NgssmDataSourceValueStatus.none,
      additionalProperties: {}
    };

    if (dataSource.dataLifetimeInSeconds) {
      dataSourceValues[dataSource.key].dataLifetimeInSeconds = dataSource.dataLifetimeInSeconds;
    }

    if (dataSource.initialParameter) {
      dataSourceValues[dataSource.key].parameter = dataSource.initialParameter;
    }

    if (dataSource.initialParameterInvalid) {
      dataSourceValues[dataSource.key].parameterIsValid = false;
    }

    dataSources[dataSource.key] = dataSource;
  });

  return updateNgssmDataState(state, {
    dataSourceValues: { $merge: dataSourceValues },
    dataSources: { $merge: dataSources }
  });
};
