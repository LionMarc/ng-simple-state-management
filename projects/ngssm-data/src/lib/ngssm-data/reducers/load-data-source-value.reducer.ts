import { Injectable } from '@angular/core';

import { DateTime } from 'luxon';

import { Reducer, State, Action } from 'ngssm-store';

import { NgssmDataActionType, NgssmLoadDataSourceValueAction } from '../actions';
import { selectNgssmDataState, updateNgssmDataState } from '../state';
import { NgssmDataSourceValueStatus } from '../model';

@Injectable()
export class LoadDataSourceValueReducer implements Reducer {
  public readonly processedActions: string[] = [NgssmDataActionType.loadDataSourceValue];

  public updateState(state: State, action: Action): State {
    if (action.type !== NgssmDataActionType.loadDataSourceValue) {
      return state;
    }

    const loadDataSourceValue = action as NgssmLoadDataSourceValueAction;

    // If data source is not defined, return input state
    const dataSource = selectNgssmDataState(state).dataSources[loadDataSourceValue.key];
    if (!dataSource) {
      return state;
    }

    let currentState = state;

    // Check if source depends on another one
    if (dataSource.dependsOnDataSource) {
      const masterSourceValue = selectNgssmDataState(state).dataSourceValues[dataSource.dependsOnDataSource];
      if (masterSourceValue && masterSourceValue.status !== NgssmDataSourceValueStatus.loaded) {
        return updateNgssmDataState(state, {
          delayedActions: {
            [dataSource.dependsOnDataSource]: { $set: action }
          }
        });
      }

      if (selectNgssmDataState(state).delayedActions[dataSource.dependsOnDataSource] === action) {
        currentState = updateNgssmDataState(state, {
          delayedActions: { $unset: [dataSource.dependsOnDataSource] }
        });
      }
    }

    const dataSourceValue = selectNgssmDataState(state).dataSourceValues[loadDataSourceValue.key];
    if (!dataSourceValue) {
      return state;
    }

    let shouldReload = false;

    if (loadDataSourceValue.options?.parameter) {
      shouldReload = true;
      currentState = updateNgssmDataState(currentState, {
        dataSourceValues: {
          [loadDataSourceValue.key]: {
            parameter: { $set: loadDataSourceValue.options?.parameter.value }
          }
        }
      });
    }

    if (dataSourceValue.status === NgssmDataSourceValueStatus.loaded) {
      if (loadDataSourceValue.options?.forceReload === true || !dataSourceValue.dataLifetimeInSeconds || !dataSourceValue.lastLoadingDate) {
        shouldReload = true;
      } else {
        const dataLifetime = DateTime.now().diff(dataSourceValue.lastLoadingDate, 'second');
        if ((dataLifetime.toObject().seconds ?? 0) > dataSourceValue.dataLifetimeInSeconds) {
          shouldReload = true;
        }
      }
    } else {
      shouldReload = true;
    }

    if (dataSourceValue.parameterIsValid === false) {
      shouldReload = false;
    }

    if (shouldReload) {
      if (loadDataSourceValue.options?.keepAdditionalProperties !== true) {
        currentState = updateNgssmDataState(currentState, {
          dataSourceValues: {
            [loadDataSourceValue.key]: {
              additionalProperties: { $set: {} }
            }
          }
        });
      }

      if (loadDataSourceValue.options?.resetValue === true) {
        currentState = updateNgssmDataState(currentState, {
          dataSourceValues: {
            [loadDataSourceValue.key]: {
              value: { $set: undefined }
            }
          }
        });
      }

      return updateNgssmDataState(currentState, {
        dataSourceValues: {
          [loadDataSourceValue.key]: {
            status: { $set: NgssmDataSourceValueStatus.loading },
            valueOutdated: { $set: false }
          }
        }
      });
    }

    return state;
  }
}
