import { Injectable } from '@angular/core';

import { Reducer, State, Action } from 'ngssm-store';

import {
  NgssmDataActionType,
  NgssmRegisterDataSourceAction,
  NgssmRegisterDataSourcesAction,
  NgssmUnregisterDataSourceAction
} from '../actions';
import { NgssmDataSource, NgssmDataSourceValue, NgssmDataSourceValueStatus } from '../model';
import { selectNgssmDataState, updateNgssmDataState } from '../state';

@Injectable()
export class DataSourcesRegistrationReducer implements Reducer {
  public readonly processedActions: string[] = [
    NgssmDataActionType.registerDataSources,
    NgssmDataActionType.registerDataSource,
    NgssmDataActionType.unregisterDataSource
  ];

  public updateState(state: State, action: Action): State {
    switch (action.type) {
      case NgssmDataActionType.registerDataSources: {
        const registerDataSourcesAction = action as NgssmRegisterDataSourcesAction;
        const dataSourceValues: Record<string, NgssmDataSourceValue> = {};
        const dataSources: Record<string, NgssmDataSource> = {};
        registerDataSourcesAction.dataSources.forEach((dataSource) => {
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
      }

      case NgssmDataActionType.registerDataSource: {
        const registerDataSourceAction = action as NgssmRegisterDataSourceAction;
        return this.updateState(state, new NgssmRegisterDataSourcesAction([registerDataSourceAction.dataSource]));
      }

      case NgssmDataActionType.unregisterDataSource: {
        const unregisterDataSource = action as NgssmUnregisterDataSourceAction;
        return updateNgssmDataState(state, {
          dataSourceValues: { $unset: [unregisterDataSource.dataSourceKey] },
          dataSources: { $unset: [unregisterDataSource.dataSourceKey] }
        });
      }
    }

    return state;
  }
}
