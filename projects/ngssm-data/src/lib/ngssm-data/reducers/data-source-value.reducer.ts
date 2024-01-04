import { Injectable } from '@angular/core';

import { DateTime } from 'luxon';

import { Reducer, State, Action } from 'ngssm-store';

import {
  NgssmClearDataSourceValueAction,
  NgssmDataActionType,
  NgssmLoadDataSourceValueAction,
  NgssmSetDataSourceParameterAction,
  NgssmSetDataSourceValueAction
} from '../actions';
import { selectNgssmDataState, updateNgssmDataState } from '../state';
import { NgssmDataSourceValueStatus } from '../model';

@Injectable()
export class DataSourceValueReducer implements Reducer {
  public readonly processedActions: string[] = [
    NgssmDataActionType.loadDataSourceValue,
    NgssmDataActionType.setDataSourceValue,
    NgssmDataActionType.clearDataSourceValue,
    NgssmDataActionType.setDataSourceParameter
  ];

  public updateState(state: State, action: Action): State {
    switch (action.type) {
      case NgssmDataActionType.loadDataSourceValue: {
        const loadDataSourceValue = action as NgssmLoadDataSourceValueAction;
        const dataSourceValue = selectNgssmDataState(state).dataSourceValues[loadDataSourceValue.key];
        if (!dataSourceValue) {
          break;
        }

        let shouldReload = false;

        if (dataSourceValue.status === NgssmDataSourceValueStatus.loaded) {
          if (loadDataSourceValue.forceReload === true || !dataSourceValue.dataLifetimeInSeconds || !dataSourceValue.lastLoadingDate) {
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

        if (shouldReload) {
          return updateNgssmDataState(state, {
            dataSourceValues: {
              [loadDataSourceValue.key]: {
                status: { $set: NgssmDataSourceValueStatus.loading }
              }
            }
          });
        }

        break;
      }

      case NgssmDataActionType.setDataSourceValue: {
        const ngssmSetDataSourceValueAction = action as NgssmSetDataSourceValueAction;
        const dataSourceValue = selectNgssmDataState(state).dataSourceValues[ngssmSetDataSourceValueAction.key];
        if (!dataSourceValue) {
          break;
        }

        return updateNgssmDataState(state, {
          dataSourceValues: {
            [ngssmSetDataSourceValueAction.key]: {
              status: { $set: ngssmSetDataSourceValueAction.status },
              value: { $set: ngssmSetDataSourceValueAction.value },
              lastLoadingDate: { $set: DateTime.now() }
            }
          }
        });
      }

      case NgssmDataActionType.clearDataSourceValue: {
        const ngssmClearDataSourceValueAction = action as NgssmClearDataSourceValueAction;
        return updateNgssmDataState(state, {
          dataSourceValues: {
            [ngssmClearDataSourceValueAction.key]: {
              status: { $set: NgssmDataSourceValueStatus.none },
              value: { $set: undefined },
              lastLoadingDate: { $set: undefined }
            }
          }
        });
      }

      case NgssmDataActionType.setDataSourceParameter: {
        const ngssmSetDataSourceParameterAction = action as NgssmSetDataSourceParameterAction;
        return updateNgssmDataState(state, {
          dataSourceValues: {
            [ngssmSetDataSourceParameterAction.key]: {
              parameter: { $set: ngssmSetDataSourceParameterAction.parameter }
            }
          }
        });
      }
    }

    return state;
  }
}
