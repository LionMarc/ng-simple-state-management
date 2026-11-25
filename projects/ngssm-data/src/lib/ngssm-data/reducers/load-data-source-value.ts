import { ReducerFunc } from 'ngssm-store';
import { DateTime } from 'luxon';

import { NgssmDataActionType } from '../actions/ngssm-data-action-type';
import { NgssmDataSourceValueAction } from '../actions/ngssm-data-source-value.action';
import { isNgssmComputedDataSource, NgssmDataSourceValueStatus } from '../model';
import { NgssmLoadDataSourceOptions } from '../model/ngssm-load-data-source-options';
import { selectNgssmDataState, updateNgssmDataState } from '../state';
import { validateDataSourceParameter } from './validate-data-source-parameter';

export class NgssmLoadDataSourceValueAction<TParameter = unknown> extends NgssmDataSourceValueAction {
  constructor(
    key: string,
    public readonly options?: NgssmLoadDataSourceOptions<TParameter>
  ) {
    super(NgssmDataActionType.loadDataSourceValue, key);
  }
}

export const loadDataSourceValue: ReducerFunc<NgssmLoadDataSourceValueAction> = (state, action) => {
  const dataSource = selectNgssmDataState(state).dataSources[action.key];
  if (!dataSource || isNgssmComputedDataSource(dataSource)) {
    return state;
  }

  let currentState = state;
  if (dataSource.dependsOnDataSource) {
    const masterSourceValue = selectNgssmDataState(state).dataSourceValues[dataSource.dependsOnDataSource];
    if (masterSourceValue && masterSourceValue.status !== NgssmDataSourceValueStatus.loaded) {
      return updateNgssmDataState(state, {
        delayedActions: {
          [dataSource.dependsOnDataSource]: { $set: action }
        }
      });
    }

    if (selectNgssmDataState(state).delayedActions[dataSource.dependsOnDataSource] === action) {
      currentState = updateNgssmDataState(state, {
        delayedActions: { $unset: [dataSource.dependsOnDataSource] }
      });
    }
  }

  const dataSourceValue = selectNgssmDataState(state).dataSourceValues[action.key];
  if (!dataSourceValue) {
    return state;
  }

  const parameterOptions = action.options?.parameter;
  const hasParameter = parameterOptions !== undefined;
  const schemaValidity = hasParameter ? validateDataSourceParameter(state, action.key, parameterOptions.value) : undefined;

  let shouldReload = false;
  if (hasParameter) {
    shouldReload = true;
    currentState = updateNgssmDataState(currentState, {
      dataSourceValues: {
        [action.key]: {
          parameter: { $set: parameterOptions.value }
        }
      }
    });
    if (schemaValidity !== undefined) {
      currentState = updateNgssmDataState(currentState, {
        dataSourceValues: {
          [action.key]: {
            parameterIsValid: { $set: schemaValidity },
            parameterPartialValidity: { $set: undefined }
          }
        }
      });
    }
  }

  if (dataSourceValue.status === NgssmDataSourceValueStatus.loaded) {
    if (action.options?.forceReload === true || !dataSourceValue.dataLifetimeInSeconds || !dataSourceValue.lastLoadingDate) {
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

  if (schemaValidity === false) {
    return updateNgssmDataState(currentState, {
      dataSourceValues: {
        [action.key]: {
          valueOutdated: { $set: true }
        }
      }
    });
  }

  if (schemaValidity === undefined && dataSourceValue.parameterIsValid === false) {
    shouldReload = false;
  }

  if (!shouldReload) {
    return state;
  }

  if (action.options?.keepAdditionalProperties !== true) {
    currentState = updateNgssmDataState(currentState, {
      dataSourceValues: {
        [action.key]: {
          additionalProperties: { $set: {} }
        }
      }
    });
  }

  if (action.options?.resetValue === true) {
    currentState = updateNgssmDataState(currentState, {
      dataSourceValues: {
        [action.key]: {
          value: { $set: undefined }
        }
      }
    });
  }

  return updateNgssmDataState(currentState, {
    dataSourceValues: {
      [action.key]: {
        status: { $set: NgssmDataSourceValueStatus.loading },
        valueOutdated: { $set: false }
      }
    }
  });
};
