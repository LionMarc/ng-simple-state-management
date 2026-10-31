import { Action, ReducerFunc } from 'ngssm-store';

import { NgssmDataActionType } from '../actions/ngssm-data-action-type';
import { NgssmDataSourceValueStatus } from '../model';
import { updateNgssmDataState } from '../state';

export class NgssmClearDataSourceValueAction implements Action {
  public readonly type: string = NgssmDataActionType.clearDataSourceValue;

  constructor(
    public readonly key: string,
    public readonly clearParameter = false
  ) {}
}

export const clearDataSourceValue: ReducerFunc<NgssmClearDataSourceValueAction> = (state, action) => {
  let currentState = state;
  if (action.clearParameter) {
    currentState = updateNgssmDataState(state, {
      dataSourceValues: {
        [action.key]: {
          parameter: { $set: undefined },
          parameterIsValid: { $set: undefined },
          parameterPartialValidity: { $set: undefined }
        }
      }
    });
  }

  return updateNgssmDataState(currentState, {
    dataSourceValues: {
      [action.key]: {
        status: { $set: NgssmDataSourceValueStatus.none },
        value: { $set: undefined },
        lastLoadingDate: { $set: undefined },
        additionalProperties: { $set: {} },
        httpErrorResponse: { $set: undefined }
      }
    }
  });
};
