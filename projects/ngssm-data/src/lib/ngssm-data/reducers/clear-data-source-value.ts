import { Action, ReducerFunc } from 'ngssm-store';

import { NgssmDataActionType } from '../actions/ngssm-data-action-type';
import { NgssmDataSourceValueStatus } from '../model';
import { updateNgssmDataState } from '../state';
import { validateDataSourceParameter } from './validate-data-source-parameter';

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
    const schemaValidity = validateDataSourceParameter(state, action.key, undefined);
    currentState = updateNgssmDataState(state, {
      dataSourceValues: {
        [action.key]: {
          parameter: { $set: undefined },
          parameterIsValid: { $set: schemaValidity },
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
