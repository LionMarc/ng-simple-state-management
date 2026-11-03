import { EnvironmentInjector, inject, runInInjectionContext } from '@angular/core';

import { EffectFunc, Logger, Store } from 'ngssm-store';

import { NgssmLoadDataSourceAdditionalPropertyValueAction, NgssmSetDataSourceAdditionalPropertyValueAction } from '../actions';
import { selectNgssmDataState } from '../state';
import { isNgssmComputedDataSource, NgssmDataSourceValueStatus } from '../model';

export const loadDataSourceAdditionalPropertyValue: EffectFunc<NgssmLoadDataSourceAdditionalPropertyValueAction> = (state, action) => {
  const store = inject(Store);
  const logger = inject(Logger);
  const injector = inject(EnvironmentInjector);
  const key = action.key;
  const dataSource = selectNgssmDataState(state).dataSources[key];
  if (!dataSource) {
    logger.error(`No data source setup for key '${key}'`);
    return;
  }

  if (isNgssmComputedDataSource(dataSource)) {
    return;
  }

  const dataSourceValue = selectNgssmDataState(state).dataSourceValues[key];
  const property = action.property;
  if (dataSourceValue.additionalProperties[property]?.status !== NgssmDataSourceValueStatus.loading) {
    logger.information(
      `Data source additional property value for '${key}' and property '${property}' is not in '${NgssmDataSourceValueStatus.loading}' status: '${dataSourceValue?.status}'`
    );
    return;
  }

  runInInjectionContext(injector, () => {
    dataSource.additionalPropertyLoadingFunc?.(state, key, property).subscribe({
      next: (value) =>
        store.dispatchAction(
          new NgssmSetDataSourceAdditionalPropertyValueAction(
            key,
            property,
            NgssmDataSourceValueStatus.loaded,
            value,
            action.postLoadingAction
          )
        ),
      error: (error) => {
        logger.error(`Unable to load data for '${key}' and property '${property}'`, error);
        store.dispatchAction(
          new NgssmSetDataSourceAdditionalPropertyValueAction(
            key,
            property,
            NgssmDataSourceValueStatus.error,
            undefined,
            action.postLoadingAction,
            error
          )
        );
      }
    });
  });
};
