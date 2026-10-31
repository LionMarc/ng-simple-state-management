import { Action, ReducerFunc } from 'ngssm-store';

import { NgssmDataActionType } from '../actions/ngssm-data-action-type';
import { NgssmDataSourceValueStatus } from '../model';
import { updateNgssmDataState } from '../state';

export class NgssmClearDataSourceAdditionalPropertyValueAction implements Action {
  public readonly type: string = NgssmDataActionType.clearDataSourceAdditionalPropertyValue;

  constructor(
    public readonly key: string,
    public readonly property: string
  ) {}
}

export const clearDataSourceAdditionalPropertyValue: ReducerFunc<NgssmClearDataSourceAdditionalPropertyValueAction> = (state, action) =>
  updateNgssmDataState(state, {
    dataSourceValues: {
      [action.key]: {
        additionalProperties: {
          [action.property]: {
            $set: {
              status: NgssmDataSourceValueStatus.none,
              value: undefined,
              lastLoadingDate: undefined,
              httpErrorResponse: undefined
            }
          }
        }
      }
    }
  });
