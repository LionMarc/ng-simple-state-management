import { Injectable } from '@angular/core';

import { DateTime } from 'luxon';

import { Reducer, State, Action } from 'ngssm-store';

import { NgssmClearDataSourceValueAction, NgssmDataActionType, NgssmSetDataSourceValueAction } from '../actions';
import { selectNgssmDataState, updateNgssmDataState } from '../state';
import { NgssmDataSourceValueStatus } from '../model';

@Injectable()
export class DataSourceValueReducer implements Reducer {
  public readonly processedActions: string[] = [NgssmDataActionType.setDataSourceValue, NgssmDataActionType.clearDataSourceValue];

  public updateState(state: State, action: Action): State {
    switch (action.type) {
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
              lastLoadingDate: { $set: DateTime.now() },
              httpErrorResponse: { $set: ngssmSetDataSourceValueAction.httpErrorResponse }
              // leave parameterPartialValidity as-is on value set (no change here)
            }
          }
        });
      }

      case NgssmDataActionType.clearDataSourceValue: {
        const ngssmClearDataSourceValueAction = action as NgssmClearDataSourceValueAction;
        let currentState = state;
        if (ngssmClearDataSourceValueAction.clearParameter) {
          currentState = updateNgssmDataState(state, {
            dataSourceValues: {
              [ngssmClearDataSourceValueAction.key]: {
                parameter: { $set: undefined },
                parameterIsValid: { $set: undefined },
                // clear partial validity when parameter is cleared
                parameterPartialValidity: { $set: undefined }
              }
            }
          });
        }

        return updateNgssmDataState(currentState, {
          dataSourceValues: {
            [ngssmClearDataSourceValueAction.key]: {
              status: { $set: NgssmDataSourceValueStatus.none },
              value: { $set: undefined },
              lastLoadingDate: { $set: undefined },
              additionalProperties: { $set: {} },
              // ensure partial-validity cleared when value is cleared
              parameterPartialValidity: { $set: undefined }
            }
          }
        });
      }
    }

    return state;
  }
}
