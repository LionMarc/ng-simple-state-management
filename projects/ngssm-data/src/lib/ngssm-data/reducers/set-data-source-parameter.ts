import { ReducerFunc } from 'ngssm-store';

import { NgssmDataActionType } from '../actions/ngssm-data-action-type';
import { NgssmDataSourceValueAction } from '../actions/ngssm-data-source-value.action';
import { throwIfSourceValueDoesNotExist } from '../selectors';
import { updateNgssmDataState } from '../state';

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

  return updateNgssmDataState(state, {
    dataSourceValues: {
      [action.key]: {
        parameter: { $set: action.parameter },
        parameterIsValid: { $set: action.parameterIsValid },
        valueOutdated: { $set: action.doNotMarkParameterAsModified === true ? false : true }
      }
    }
  });
};
