import { HttpErrorResponse } from '@angular/common/http';
import { Action, ReducerFunc } from 'ngssm-store';
import { DateTime } from 'luxon';

import { NgssmDataActionType } from '../actions/ngssm-data-action-type';
import { NgssmDataSourceValueStatus } from '../model';
import { selectNgssmDataState, updateNgssmDataState } from '../state';

export class NgssmSetDataSourceValueAction<TData = unknown> implements Action {
  public readonly type: string = NgssmDataActionType.setDataSourceValue;

  constructor(
    public readonly key: string,
    public readonly status: NgssmDataSourceValueStatus,
    public readonly value?: TData,
    public readonly httpErrorResponse?: HttpErrorResponse
  ) {}
}

export const setDataSourceValue: ReducerFunc<NgssmSetDataSourceValueAction> = (state, action) => {
  if (!selectNgssmDataState(state).dataSourceValues[action.key]) {
    return state;
  }

  return updateNgssmDataState(state, {
    dataSourceValues: {
      [action.key]: {
        status: { $set: action.status },
        value: { $set: action.value },
        lastLoadingDate: { $set: DateTime.now() },
        httpErrorResponse: { $set: action.httpErrorResponse }
      }
    }
  });
};
