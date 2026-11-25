import { ReducerFunc } from 'ngssm-store';

import { NgssmDataActionType } from '../actions/ngssm-data-action-type';
import { NgssmDataSourceValueAction } from '../actions/ngssm-data-source-value.action';
import { selectNgssmDataSourceValue, throwIfSourceValueDoesNotExist } from '../selectors';
import { updateNgssmDataState } from '../state';
import { validateDataSourceParameter } from './validate-data-source-parameter';

export class NgssmUpdateDataSourceParameterWithFunctionAction<TParameter = unknown> extends NgssmDataSourceValueAction {
  constructor(
    key: string,
    public readonly updateParameter: (parameter: TParameter | undefined) => TParameter,
    public readonly doNotUpdateValueOutdated?: boolean
  ) {
    super(NgssmDataActionType.updateDataSourceParameterWithFunction, key);
  }
}

export const updateDataSourceParameterWithFunction: ReducerFunc<NgssmUpdateDataSourceParameterWithFunctionAction> = (state, action) => {
  throwIfSourceValueDoesNotExist(state, action.key);
  const currentParameter = selectNgssmDataSourceValue(state, action.key)?.parameter;
  const newParameter = action.updateParameter(currentParameter);
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
