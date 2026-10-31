import { Action, ReducerFunc } from 'ngssm-store';

import { NgssmDataActionType } from '../actions/ngssm-data-action-type';
import { NgssmDataSourceValueStatus } from '../model';
import { selectNgssmDataState, updateNgssmDataState } from '../state';

export class NgssmLoadDataSourceAdditionalPropertyValueAction implements Action {
  public readonly type: string = NgssmDataActionType.loadDataSourceAdditionalPropertyValue;

  constructor(
    public readonly key: string,
    public readonly property: string,
    public readonly forceReload?: boolean,
    public readonly postLoadingAction?: () => void
  ) {}
}

export const loadDataSourceAdditionalPropertyValue: ReducerFunc<NgssmLoadDataSourceAdditionalPropertyValueAction> = (state, action) => {
  const propertyValue = selectNgssmDataState(state).dataSourceValues[action.key]?.additionalProperties[action.property];

  if (propertyValue?.status === NgssmDataSourceValueStatus.loaded && action.forceReload !== true) {
    return state;
  }

  if (!propertyValue) {
    return updateNgssmDataState(state, {
      dataSourceValues: {
        [action.key]: {
          additionalProperties: {
            [action.property]: {
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
      [action.key]: {
        additionalProperties: {
          [action.property]: {
            status: { $set: NgssmDataSourceValueStatus.loading }
          }
        }
      }
    }
  });
};
