import { ReducerFunc } from 'ngssm-store';

import { NgssmDataActionType } from '../actions/ngssm-data-action-type';
import { NgssmDataSourceValueAction } from '../actions/ngssm-data-source-value.action';
import { throwIfSourceValueDoesNotExist } from '../selectors';
import { updateNgssmDataState } from '../state';
import { validateDataSourceParameter } from './validate-data-source-parameter';

export class NgssmSetDataSourceParameterAction<TParameter = unknown> extends NgssmDataSourceValueAction {
  constructor(
    key: string,
    public readonly parameter?: TParameter,
    public readonly parameterIsValid?: boolean,
    public readonly doNotMarkParameterAsModified?: boolean
  ) {
    super(NgssmDataActionType.setDataSourceParameter, key);
  }
}

export const setDataSourceParameter: ReducerFunc<NgssmSetDataSourceParameterAction> = (state, action) => {
  throwIfSourceValueDoesNotExist(state, action.key);

  const schemaValidity = validateDataSourceParameter(state, action.key, action.parameter);
  const parameterIsValid = schemaValidity === undefined ? action.parameterIsValid : schemaValidity && action.parameterIsValid !== false;
  const clearPartialValidity = schemaValidity !== undefined;

  return updateNgssmDataState(state, {
    dataSourceValues: {
      [action.key]: {
        parameter: { $set: action.parameter },
        parameterIsValid: { $set: parameterIsValid },
        ...(clearPartialValidity ? { parameterPartialValidity: { $set: undefined } } : {}),
        valueOutdated: { $set: action.doNotMarkParameterAsModified === true ? false : true }
      }
    }
  });
};
