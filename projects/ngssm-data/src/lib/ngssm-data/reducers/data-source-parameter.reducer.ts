import { Injectable } from '@angular/core';

import update from 'immutability-helper';

import { Reducer, State, Action } from 'ngssm-store';

import {
  NgssmDataActionType,
  NgssmSetDataSourceParameterAction,
  NgssmSetDataSourceParameterValidityAction,
  NgssmUpdateDataSourceParameterAction
} from '../actions';
import { updateNgssmDataState } from '../state';
import { selectNgssmDataSourceValue } from '../selectors';

@Injectable()
export class DataSourceParameterReducer implements Reducer {
  public readonly processedActions: string[] = [
    NgssmDataActionType.setDataSourceParameter,
    NgssmDataActionType.updateDataSourceParameter,
    NgssmDataActionType.setDataSourceParameterValidity
  ];

  public updateState(state: State, action: Action): State {
    switch (action.type) {
      case NgssmDataActionType.setDataSourceParameter: {
        const ngssmSetDataSourceParameterAction = action as NgssmSetDataSourceParameterAction;
        return updateNgssmDataState(state, {
          dataSourceValues: {
            [ngssmSetDataSourceParameterAction.key]: {
              parameter: { $set: ngssmSetDataSourceParameterAction.parameter },
              parameterIsValid: { $set: ngssmSetDataSourceParameterAction.parameterIsValid },
              valueOutdated: { $set: ngssmSetDataSourceParameterAction.doNotMarkParameterAsModified === true ? false : true }
              // leave parameterPartialValidity as-is on value set (no change here)
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

        const updatedState = updateNgssmDataState(state, {
          dataSourceValues: {
            [ngssmUpdateDataSourceParameterAction.key]: {
              parameter: { $set: newParameter }
            }
          }
        });

        if (ngssmUpdateDataSourceParameterAction.doNotUpdateValueOutdated == true) {
          return updatedState;
        }

        return updateNgssmDataState(updatedState, {
          dataSourceValues: {
            [ngssmUpdateDataSourceParameterAction.key]: {
              valueOutdated: { $set: true }
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
