import { Injectable } from '@angular/core';

import { Reducer, State, Action } from 'ngssm-store';

import { NgssmDataActionType, NgssmInitDataSourceValuesAction } from '../actions';
import { NgssmDataSource, NgssmDataSourceValue, NgssmDataSourceValueStatus } from '../model';
import { updateNgssmDataState } from '../state';

@Injectable()
export class DataSourcesInitializationReducer implements Reducer {
  public readonly processedActions: string[] = [NgssmDataActionType.initDataSourceValues];

  public updateState(state: State, action: Action): State {
    if (action.type === NgssmDataActionType.initDataSourceValues) {
      const initDataSourceValues = action as NgssmInitDataSourceValuesAction;
      const dataSourceValues: { [key: string]: NgssmDataSourceValue } = {};
      const dataSources: { [key: string]: NgssmDataSource } = {};
      initDataSourceValues.dataSources.forEach((dataSource) => {
        dataSourceValues[dataSource.key] = {
          status: NgssmDataSourceValueStatus.none
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
