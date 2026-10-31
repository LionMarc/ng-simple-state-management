import { ReducerFunc } from 'ngssm-store';

import { NgssmDataActionType } from '../actions/ngssm-data-action-type';
import { NgssmDataSourceValueAction } from '../actions/ngssm-data-source-value.action';
import { selectNgssmDataSourceValue, throwIfSourceValueDoesNotExist } from '../selectors';
import { updateNgssmDataState } from '../state';

export class NgssmSetDataSourceParameterValidityAction extends NgssmDataSourceValueAction {
  constructor(
    key: string,
    public readonly isValid: boolean,
    public readonly partialValidityKey?: string,
    public readonly clearPartialValidities?: boolean
  ) {
    super(NgssmDataActionType.setDataSourceParameterValidity, key);
  }
}

export const setDataSourceParameterValidity: ReducerFunc<NgssmSetDataSourceParameterValidityAction> = (state, action) => {
  throwIfSourceValueDoesNotExist(state, action.key);

  if (action.partialValidityKey) {
    if (selectNgssmDataSourceValue(state, action.key)?.parameterPartialValidity) {
      return updateNgssmDataState(state, {
        dataSourceValues: {
          [action.key]: {
            parameterPartialValidity: {
              [action.partialValidityKey]: { $set: action.isValid }
            }
          }
        }
      });
    }

    return updateNgssmDataState(state, {
      dataSourceValues: {
        [action.key]: {
          parameterPartialValidity: {
            $set: {
              [action.partialValidityKey]: action.isValid
            }
          }
        }
      }
    });
  }

  if (action.clearPartialValidities === true) {
    return updateNgssmDataState(state, {
      dataSourceValues: {
        [action.key]: {
          parameterIsValid: { $set: action.isValid },
          parameterPartialValidity: { $set: undefined }
        }
      }
    });
  }

  return updateNgssmDataState(state, {
    dataSourceValues: {
      [action.key]: {
        parameterIsValid: { $set: action.isValid }
      }
    }
  });
};
