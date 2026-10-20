import { Injectable } from '@angular/core';

import update from 'immutability-helper';

import { Reducer, State, Action } from 'ngssm-store';

import {
  NgssmDataActionType,
  NgssmDataSourceValueAction,
  NgssmSetDataSourceParameterAction,
  NgssmSetDataSourceParameterValidityAction,
  NgssmUpdateDataSourceParameterAction,
  NgssmUpdateDataSourceParameterWithFunctionAction
} from '../actions';
import { updateNgssmDataState } from '../state';
import { selectNgssmDataSourceValue, throwIfSourceValueDoesNotExist } from '../selectors';

@Injectable()
export class DataSourceParameterReducer implements Reducer {
  public readonly processedActions: string[] = [
    NgssmDataActionType.setDataSourceParameter,
    NgssmDataActionType.updateDataSourceParameter,
    NgssmDataActionType.updateDataSourceParameterWithFunction,
    NgssmDataActionType.setDataSourceParameterValidity
  ];

  public updateState(state: State, action: Action): State {
    throwIfSourceValueDoesNotExist(state, (action as NgssmDataSourceValueAction).key);

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

        return this.updateParameter(
          state,
          ngssmUpdateDataSourceParameterAction.key,
          newParameter,
          ngssmUpdateDataSourceParameterAction.doNotUpdateValueOutdated
        );
      }

      case NgssmDataActionType.updateDataSourceParameterWithFunction: {
        const ngssmUpdateDataSourceParameterAction = action as NgssmUpdateDataSourceParameterWithFunctionAction;
        const currentParameter = selectNgssmDataSourceValue(state, ngssmUpdateDataSourceParameterAction.key)?.parameter;
        const newParameter = ngssmUpdateDataSourceParameterAction.updateParameter(currentParameter);

        return this.updateParameter(
          state,
          ngssmUpdateDataSourceParameterAction.key,
          newParameter,
          ngssmUpdateDataSourceParameterAction.doNotUpdateValueOutdated
        );
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
          ngssmSetDataSourceParameterValidityAction.isValid,
          ngssmSetDataSourceParameterValidityAction.clearPartialValidities
        );
      }
    }

    return state;
  }

  private updateParameter(state: State, key: string, parameter: unknown, doNotUpdateValueOutdated?: boolean): State {
    const updatedState = updateNgssmDataState(state, {
      dataSourceValues: {
        [key]: {
          parameter: { $set: parameter }
        }
      }
    });

    if (doNotUpdateValueOutdated === true) {
      return updatedState;
    }

    return updateNgssmDataState(updatedState, {
      dataSourceValues: {
        [key]: {
          valueOutdated: { $set: true }
        }
      }
    });
  }

  private setGlobalValidity(state: State, key: string, isValid: boolean, clearPartialValidities?: boolean): State {
    if (clearPartialValidities === true) {
      return updateNgssmDataState(state, {
        dataSourceValues: {
          [key]: {
            parameterIsValid: { $set: isValid },
            parameterPartialValidity: { $set: undefined }
          }
        }
      });
    }

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
