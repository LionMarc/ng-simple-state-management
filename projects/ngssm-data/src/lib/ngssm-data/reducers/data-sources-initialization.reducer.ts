import { Injectable } from '@angular/core';

import { Reducer, State, Action } from 'ngssm-store';

import { NgssmDataActionType, NgssmInitDataSourceValuesAction } from '../actions';
import { NgssmDataSourceValue, NgssmDataSourceValueStatus } from '../model';
import { updateNgssmDataState } from '../state';

@Injectable()
export class DataSourcesInitializationReducer implements Reducer {
  public readonly processedActions: string[] = [NgssmDataActionType.initDataSourceValues];

  public updateState(state: State, action: Action): State {
    if (action.type === NgssmDataActionType.initDataSourceValues) {
      const initDataSourceValues = action as NgssmInitDataSourceValuesAction;
      const dataSources: { [key: string]: NgssmDataSourceValue } = {};
      initDataSourceValues.keys.forEach((key) => {
        dataSources[key] = {
          status: NgssmDataSourceValueStatus.none
        };
      });
      return updateNgssmDataState(state, {
        dataSourceValues: { $merge: dataSources }
      });
    }

    return state;
  }
}
