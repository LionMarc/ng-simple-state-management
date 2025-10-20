import { Injectable } from '@angular/core';

import { DateTime } from 'luxon';
import update from 'immutability-helper';

import { Reducer, State, Action } from 'ngssm-store';

import {
  NgssmClearDataSourceValueAction,
  NgssmDataActionType,
  NgssmSetDataSourceParameterAction,
  NgssmSetDataSourceParameterValidityAction,
  NgssmSetDataSourceValueAction,
  NgssmUpdateDataSourceParameterAction
} from '../actions';
import { selectNgssmDataState, updateNgssmDataState } from '../state';
import { NgssmDataSourceValueStatus } from '../model';
import { selectNgssmDataSourceValue } from '../selectors';

@Injectable()
export class DataSourceValueReducer implements Reducer {
  public readonly processedActions: string[] = [
    NgssmDataActionType.setDataSourceValue,
    NgssmDataActionType.clearDataSourceValue,
    NgssmDataActionType.setDataSourceParameter,
    NgssmDataActionType.updateDataSourceParameter,
    NgssmDataActionType.setDataSourceParameterValidity
  ];

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

      case NgssmDataActionType.setDataSourceParameter: {
        const ngssmSetDataSourceParameterAction = action as NgssmSetDataSourceParameterAction;
        return updateNgssmDataState(state, {
          dataSourceValues: {
            [ngssmSetDataSourceParameterAction.key]: {
              parameter: { $set: ngssmSetDataSourceParameterAction.parameter },
              parameterIsValid: { $set: ngssmSetDataSourceParameterAction.parameterIsValid },
              valueOutdated: { $set: ngssmSetDataSourceParameterAction.doNotMarkParameterAsModified === true ? false : true },
              // reset partial validity when parameter is explicitly set
              parameterPartialValidity: { $set: undefined }
            }
          }
        });
      }

      case NgssmDataActionType.updateDataSourceParameter: {
        const ngssmUpdateDataSourceParameterAction = action as NgssmUpdateDataSourceParameterAction;
        const newParameter = update<object, never>(
          selectNgssmDataSourceValue(state, ngssmUpdateDataSourceParameterAction.key)?.parameter as object,
          {
            $merge: ngssmUpdateDataSourceParameterAction.parameter
          }
        );
        return updateNgssmDataState(state, {
          dataSourceValues: {
            [ngssmUpdateDataSourceParameterAction.key]: {
              parameter: { $set: newParameter },
              valueOutdated: { $set: true },
              // reset partial validity when parameter is updated
              parameterPartialValidity: { $set: undefined }
            }
          }
        });
      }

      case NgssmDataActionType.setDataSourceParameterValidity: {
        const ngssmSetDataSourceParameterValidityAction = action as NgssmSetDataSourceParameterValidityAction;
        if (ngssmSetDataSourceParameterValidityAction.partialValidityKey) {
          return this.setPartialValidity(
            state,
            ngssmSetDataSourceParameterValidityAction.key,
            ngssmSetDataSourceParameterValidityAction.isValid,
            ngssmSetDataSourceParameterValidityAction.partialValidityKey
          );
        }

        return this.setGlobalValidity(
          state,
          ngssmSetDataSourceParameterValidityAction.key,
          ngssmSetDataSourceParameterValidityAction.isValid
        );
      }
    }

    return state;
  }

  private setGlobalValidity(state: State, key: string, isValid: boolean): State {
    return updateNgssmDataState(state, {
      dataSourceValues: {
        [key]: {
          parameterIsValid: { $set: isValid }
        }
      }
    });
  }

  private setPartialValidity(state: State, key: string, isValid: boolean, partialKey: string): State {
    if (selectNgssmDataSourceValue(state, key)?.parameterPartialValidity) {
      return updateNgssmDataState(state, {
        dataSourceValues: {
          [key]: {
            parameterPartialValidity: {
              [partialKey]: { $set: isValid }
            }
          }
        }
      });
    }

    return updateNgssmDataState(state, {
      dataSourceValues: {
        [key]: {
          parameterPartialValidity: {
            $set: {
              [partialKey]: isValid
            }
          }
        }
      }
    });
  }
}
