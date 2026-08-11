import { Injectable } from '@angular/core';

import { DateTime } from 'luxon';

import { Reducer, State, Action } from 'ngssm-store';

import {
  NgssmClearDataSourceAdditionalPropertyValueAction,
  NgssmDataActionType,
  NgssmLoadDataSourceAdditionalPropertyValueAction,
  NgssmSetDataSourceAdditionalPropertyValueAction
} from '../actions';
import { selectNgssmDataState, updateNgssmDataState } from '../state';
import { NgssmDataSourceValueStatus } from '../model';

@Injectable()
export class DataSourceAdditionalPropertyValueReducer implements Reducer {
  public readonly processedActions: string[] = [
    NgssmDataActionType.loadDataSourceAdditionalPropertyValue,
    NgssmDataActionType.setDataSourceAdditionalPropertyValue,
    NgssmDataActionType.clearDataSourceAdditionalPropertyValue
  ];

  public updateState(state: State, action: Action): State {
    switch (action.type) {
      case NgssmDataActionType.loadDataSourceAdditionalPropertyValue: {
        const ngssmLoadDataSourceAdditionalPropertyValueAction = action as NgssmLoadDataSourceAdditionalPropertyValueAction;
        const dataSourcePropertyValue =
          selectNgssmDataState(state).dataSourceValues[ngssmLoadDataSourceAdditionalPropertyValueAction.key]?.additionalProperties[
            ngssmLoadDataSourceAdditionalPropertyValueAction.property
          ];

        if (
          dataSourcePropertyValue?.status === NgssmDataSourceValueStatus.loaded &&
          ngssmLoadDataSourceAdditionalPropertyValueAction.forceReload !== true
        ) {
          break;
        }

        if (!dataSourcePropertyValue) {
          return updateNgssmDataState(state, {
            dataSourceValues: {
              [ngssmLoadDataSourceAdditionalPropertyValueAction.key]: {
                additionalProperties: {
                  [ngssmLoadDataSourceAdditionalPropertyValueAction.property]: {
                    $set: {
                      status: NgssmDataSourceValueStatus.loading
                    }
                  }
                }
              }
            }
          });
        }

        return updateNgssmDataState(state, {
          dataSourceValues: {
            [ngssmLoadDataSourceAdditionalPropertyValueAction.key]: {
              additionalProperties: {
                [ngssmLoadDataSourceAdditionalPropertyValueAction.property]: {
                  status: { $set: NgssmDataSourceValueStatus.loading }
                }
              }
            }
          }
        });
      }

      case NgssmDataActionType.setDataSourceAdditionalPropertyValue: {
        const ngssmSetDataSourceAdditionalPropertyValueAction = action as NgssmSetDataSourceAdditionalPropertyValueAction;
        return updateNgssmDataState(state, {
          dataSourceValues: {
            [ngssmSetDataSourceAdditionalPropertyValueAction.key]: {
              additionalProperties: {
                [ngssmSetDataSourceAdditionalPropertyValueAction.property]: {
                  $set: {
                    status: ngssmSetDataSourceAdditionalPropertyValueAction.status,
                    value: ngssmSetDataSourceAdditionalPropertyValueAction.value,
                    lastLoadingDate: DateTime.now(),
                    httpErrorResponse: ngssmSetDataSourceAdditionalPropertyValueAction.httpErrorResponse
                  }
                }
              }
            }
          }
        });
      }

      case NgssmDataActionType.clearDataSourceAdditionalPropertyValue: {
        const ngssmClearDataSourceAdditionalPropertyValueAction = action as NgssmClearDataSourceAdditionalPropertyValueAction;
        return updateNgssmDataState(state, {
          dataSourceValues: {
            [ngssmClearDataSourceAdditionalPropertyValueAction.key]: {
              additionalProperties: {
                [ngssmClearDataSourceAdditionalPropertyValueAction.property]: {
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
      }
    }

    return state;
  }
}
