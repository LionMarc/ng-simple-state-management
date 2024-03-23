import { Injectable } from '@angular/core';

import { DateTime } from 'luxon';

import { Reducer, State, Action } from 'ngssm-store';

import {
  NgssmClearDataSourceValueAction,
  NgssmDataActionType,
  NgssmLoadDataSourceAdditionalPropertyValueAction,
  NgssmLoadDataSourceValueAction,
  NgssmSetDataSourceAdditionalPropertyValueAction,
  NgssmSetDataSourceParameterAction,
  NgssmSetDataSourceValueAction
} from '../actions';
import { selectNgssmDataState, updateNgssmDataState } from '../state';
import { NgssmDataSourceValueStatus } from '../model';

@Injectable()
export class DataSourceValueReducer implements Reducer {
  public readonly processedActions: string[] = [
    NgssmDataActionType.loadDataSourceValue,
    NgssmDataActionType.setDataSourceValue,
    NgssmDataActionType.clearDataSourceValue,
    NgssmDataActionType.setDataSourceParameter,
    NgssmDataActionType.loadDataSourceAdditionalPropertyValue,
    NgssmDataActionType.setDataSourceAdditionalPropertyValue
  ];

  public updateState(state: State, action: Action): State {
    switch (action.type) {
      case NgssmDataActionType.loadDataSourceValue: {
        const loadDataSourceValue = action as NgssmLoadDataSourceValueAction;
        const dataSourceValue = selectNgssmDataState(state).dataSourceValues[loadDataSourceValue.key];
        if (!dataSourceValue) {
          break;
        }

        let shouldReload = false;

        let currentState = state;
        if (loadDataSourceValue.options?.parameter) {
          shouldReload = true;
          currentState = updateNgssmDataState(state, {
            dataSourceValues: {
              [loadDataSourceValue.key]: {
                parameter: { $set: loadDataSourceValue.options?.parameter.value }
              }
            }
          });
        }

        if (dataSourceValue.status === NgssmDataSourceValueStatus.loaded) {
          if (
            loadDataSourceValue.options?.forceReload === true ||
            !dataSourceValue.dataLifetimeInSeconds ||
            !dataSourceValue.lastLoadingDate
          ) {
            shouldReload = true;
          } else {
            const dataLifetime = DateTime.now().diff(dataSourceValue.lastLoadingDate, 'second');
            if ((dataLifetime.toObject().seconds ?? 0) > dataSourceValue.dataLifetimeInSeconds) {
              shouldReload = true;
            }
          }
        } else {
          shouldReload = true;
        }

        if (shouldReload) {
          if (loadDataSourceValue.options?.keepAdditionalProperties === true) {
            return updateNgssmDataState(currentState, {
              dataSourceValues: {
                [loadDataSourceValue.key]: {
                  status: { $set: NgssmDataSourceValueStatus.loading }
                }
              }
            });
          }

          return updateNgssmDataState(currentState, {
            dataSourceValues: {
              [loadDataSourceValue.key]: {
                status: { $set: NgssmDataSourceValueStatus.loading },
                additionalProperties: { $set: {} }
              }
            }
          });
        }

        break;
      }

      case NgssmDataActionType.setDataSourceValue: {
        const ngssmSetDataSourceValueAction = action as NgssmSetDataSourceValueAction;
        const dataSourceValue = selectNgssmDataState(state).dataSourceValues[ngssmSetDataSourceValueAction.key];
        if (!dataSourceValue) {
          break;
        }

        return updateNgssmDataState(state, {
          dataSourceValues: {
            [ngssmSetDataSourceValueAction.key]: {
              status: { $set: ngssmSetDataSourceValueAction.status },
              value: { $set: ngssmSetDataSourceValueAction.value },
              lastLoadingDate: { $set: DateTime.now() }
            }
          }
        });
      }

      case NgssmDataActionType.clearDataSourceValue: {
        const ngssmClearDataSourceValueAction = action as NgssmClearDataSourceValueAction;
        let currentState = state;
        if (ngssmClearDataSourceValueAction.clearParameter) {
          currentState = updateNgssmDataState(state, {
            dataSourceValues: {
              [ngssmClearDataSourceValueAction.key]: {
                parameter: { $set: undefined }
              }
            }
          });
        }

        return updateNgssmDataState(currentState, {
          dataSourceValues: {
            [ngssmClearDataSourceValueAction.key]: {
              status: { $set: NgssmDataSourceValueStatus.none },
              value: { $set: undefined },
              lastLoadingDate: { $set: undefined },
              additionalProperties: { $set: {} }
            }
          }
        });
      }

      case NgssmDataActionType.setDataSourceParameter: {
        const ngssmSetDataSourceParameterAction = action as NgssmSetDataSourceParameterAction;
        return updateNgssmDataState(state, {
          dataSourceValues: {
            [ngssmSetDataSourceParameterAction.key]: {
              parameter: { $set: ngssmSetDataSourceParameterAction.parameter }
            }
          }
        });
      }

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
        const dataSourcePropertyValue =
          selectNgssmDataState(state).dataSourceValues[ngssmSetDataSourceAdditionalPropertyValueAction.key]?.additionalProperties[
            ngssmSetDataSourceAdditionalPropertyValueAction.property
          ];

        if (!dataSourcePropertyValue) {
          break;
        }

        return updateNgssmDataState(state, {
          dataSourceValues: {
            [ngssmSetDataSourceAdditionalPropertyValueAction.key]: {
              additionalProperties: {
                [ngssmSetDataSourceAdditionalPropertyValueAction.property]: {
                  $set: {
                    status: ngssmSetDataSourceAdditionalPropertyValueAction.status,
                    value: ngssmSetDataSourceAdditionalPropertyValueAction.value
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
