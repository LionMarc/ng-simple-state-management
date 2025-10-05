import { Injectable } from '@angular/core';

import { DateTime } from 'luxon';

import { Reducer, State, Action } from 'ngssm-store';

import {
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
    NgssmDataActionType.setDataSourceAdditionalPropertyValue
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
    }

    return state;
  }
}
