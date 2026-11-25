import update from 'immutability-helper';
import { ReducerFunc } from 'ngssm-store';

import { NgssmDataActionType } from '../actions/ngssm-data-action-type';
import { NgssmDataSourceValueAction } from '../actions/ngssm-data-source-value.action';
import { selectNgssmDataSourceValue, throwIfSourceValueDoesNotExist } from '../selectors';
import { updateNgssmDataState } from '../state';
import { validateDataSourceParameter } from './validate-data-source-parameter';

export class NgssmUpdateDataSourceParameterAction<TParameter = unknown> extends NgssmDataSourceValueAction {
  constructor(
    key: string,
    public readonly parameter: Partial<TParameter>,
    public readonly doNotUpdateValueOutdated?: boolean
  ) {
    super(NgssmDataActionType.updateDataSourceParameter, key);
  }
}

export const updateDataSourceParameter: ReducerFunc<NgssmUpdateDataSourceParameterAction> = (state, action) => {
  throwIfSourceValueDoesNotExist(state, action.key);
  const newParameter = update<object, never>(selectNgssmDataSourceValue(state, action.key)?.parameter as object, {
    $merge: action.parameter
  });
  const schemaValidity = validateDataSourceParameter(state, action.key, newParameter);
  const clearPartialValidity = schemaValidity !== undefined;
  const updatedState = updateNgssmDataState(state, {
    dataSourceValues: {
      [action.key]: {
        parameter: { $set: newParameter },
        ...(clearPartialValidity
          ? {
              parameterIsValid: { $set: schemaValidity },
              parameterPartialValidity: { $set: undefined }
            }
          : {})
      }
    }
  });

  if (action.doNotUpdateValueOutdated === true) {
    return updatedState;
  }

  return updateNgssmDataState(updatedState, {
    dataSourceValues: {
      [action.key]: {
        valueOutdated: { $set: true }
      }
    }
  });
};
