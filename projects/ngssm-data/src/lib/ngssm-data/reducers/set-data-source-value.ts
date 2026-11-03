import { HttpErrorResponse } from '@angular/common/http';
import { Action, ReducerFunc } from 'ngssm-store';
import { DateTime } from 'luxon';

import { NgssmDataActionType } from '../actions/ngssm-data-action-type';
import { isNgssmComputedDataSource, NgssmDataSourceValueStatus } from '../model';
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

  let updatedState = updateNgssmDataState(state, {
    dataSourceValues: {
      [action.key]: {
        status: { $set: action.status },
        value: { $set: action.value },
        lastLoadingDate: { $set: DateTime.now() },
        httpErrorResponse: { $set: action.httpErrorResponse }
      }
    }
  });

  const computedDataSources = Object.values(selectNgssmDataState(state).dataSources).filter(isNgssmComputedDataSource);
  const computedDataSourcesByKey = new Map(computedDataSources.map((dataSource) => [dataSource.key, dataSource]));
  const updatedDataSourceKeys = [action.key];
  const affectedComputedDataSourceKeys = new Set<string>();

  for (const updatedDataSourceKey of updatedDataSourceKeys) {
    for (const computedDataSource of computedDataSources) {
      if (
        affectedComputedDataSourceKeys.has(computedDataSource.key) ||
        (computedDataSource.linkedToDataSource !== updatedDataSourceKey &&
          !computedDataSource.linkedToDataSources?.includes(updatedDataSourceKey))
      ) {
        continue;
      }

      affectedComputedDataSourceKeys.add(computedDataSource.key);
      updatedDataSourceKeys.push(computedDataSource.key);
    }
  }

  const computedDataSourceKeys = new Set<string>();
  const computingDataSourceKeys = new Set<string>();
  const computeDataSource = (key: string): void => {
    if (computedDataSourceKeys.has(key)) {
      return;
    }

    if (computingDataSourceKeys.has(key)) {
      throw new Error(`Circular computed data source dependency detected for '${key}'`);
    }

    const computedDataSource = computedDataSourcesByKey.get(key);
    if (!computedDataSource) {
      return;
    }

    computingDataSourceKeys.add(key);
    const linkedKeys = [computedDataSource.linkedToDataSource, ...(computedDataSource.linkedToDataSources ?? [])];
    linkedKeys.forEach((linkedKey) => {
      if (linkedKey && affectedComputedDataSourceKeys.has(linkedKey)) {
        computeDataSource(linkedKey);
      }
    });

    const value = computedDataSource.computationFunc(updatedState);
    updatedState = updateNgssmDataState(updatedState, {
      dataSourceValues: {
        [computedDataSource.key]: {
          status: { $set: NgssmDataSourceValueStatus.loaded },
          value: { $set: value },
          lastLoadingDate: { $set: DateTime.now() },
          httpErrorResponse: { $set: undefined },
          valueOutdated: { $set: false }
        }
      }
    });
    computingDataSourceKeys.delete(key);
    computedDataSourceKeys.add(key);
  };

  affectedComputedDataSourceKeys.forEach(computeDataSource);

  return updatedState;
};
