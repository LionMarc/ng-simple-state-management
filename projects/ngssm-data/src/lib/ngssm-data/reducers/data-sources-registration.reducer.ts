import { Injectable } from '@angular/core';

import { Reducer, State, Action } from 'ngssm-store';

import { NgssmDataActionType, NgssmRegisterDataSourcesAction } from '../actions';
import { NgssmDataSource, NgssmDataSourceValue, NgssmDataSourceValueStatus } from '../model';
import { selectNgssmDataState, updateNgssmDataState } from '../state';

@Injectable()
export class DataSourcesRegistrationReducer implements Reducer {
  public readonly processedActions: string[] = [NgssmDataActionType.registerDataSources];

  public updateState(state: State, action: Action): State {
    if (action.type === NgssmDataActionType.registerDataSources) {
      const registerDataSourcesAction = action as NgssmRegisterDataSourcesAction;
      const dataSourceValues: { [key: string]: NgssmDataSourceValue } = {};
      const dataSources: { [key: string]: NgssmDataSource } = {};
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

        dataSources[dataSource.key] = dataSource;
      });

      return updateNgssmDataState(state, {
        dataSourceValues: { $merge: dataSourceValues },
        dataSources: { $merge: dataSources }
      });
    }

    return state;
  }
}
