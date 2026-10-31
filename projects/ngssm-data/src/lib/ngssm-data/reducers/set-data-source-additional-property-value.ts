import { HttpErrorResponse } from '@angular/common/http';
import { Action, ReducerFunc } from 'ngssm-store';
import { DateTime } from 'luxon';

import { NgssmDataActionType } from '../actions/ngssm-data-action-type';
import { NgssmDataSourceValueStatus } from '../model';
import { updateNgssmDataState } from '../state';

export class NgssmSetDataSourceAdditionalPropertyValueAction<TProperty = unknown> implements Action {
  public readonly type: string = NgssmDataActionType.setDataSourceAdditionalPropertyValue;

  constructor(
    public readonly key: string,
    public readonly property: string,
    public readonly status: NgssmDataSourceValueStatus,
    public readonly value?: TProperty,
    public readonly postLoadingAction?: () => void,
    public readonly httpErrorResponse?: HttpErrorResponse
  ) {}
}

export const setDataSourceAdditionalPropertyValue: ReducerFunc<NgssmSetDataSourceAdditionalPropertyValueAction> = (state, action) =>
  updateNgssmDataState(state, {
    dataSourceValues: {
      [action.key]: {
        additionalProperties: {
          [action.property]: {
            $set: {
              status: action.status,
              value: action.value,
              lastLoadingDate: DateTime.now(),
              httpErrorResponse: action.httpErrorResponse
            }
          }
        }
      }
    }
  });
