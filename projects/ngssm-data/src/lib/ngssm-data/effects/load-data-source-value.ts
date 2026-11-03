import { EnvironmentInjector, inject, runInInjectionContext } from '@angular/core';
import { defer, finalize } from 'rxjs';

import { EffectFunc, Logger, Store } from 'ngssm-store';

import { NgssmLoadDataSourceValueAction, NgssmSetDataSourceValueAction } from '../actions';
import { selectNgssmDataState } from '../state';
import { isNgssmComputedDataSource, NgssmDataSourceValueStatus } from '../model';

const inFlightDataSourceKeys = new WeakMap<Store, Set<string>>();

export const loadDataSourceValue: EffectFunc<NgssmLoadDataSourceValueAction> = (state, action) => {
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
  let loadingKeys = inFlightDataSourceKeys.get(store);
  if (!loadingKeys) {
    loadingKeys = new Set<string>();
    inFlightDataSourceKeys.set(store, loadingKeys);
  }

  if (loadingKeys.has(key)) {
    logger.information(`Data source value for '${key}' is already loading`);
    return;
  }

  if (dataSourceValue?.status !== NgssmDataSourceValueStatus.loading) {
    logger.information(
      `Data source value for '${key}' is not in '${NgssmDataSourceValueStatus.loading}' status: '${dataSourceValue?.status}'`
    );
    return;
  }

  loadingKeys.add(key);
  defer(() => runInInjectionContext(injector, () => dataSource.dataLoadingFunc(state, key, dataSourceValue.parameter)))
    .pipe(finalize(() => loadingKeys.delete(key)))
    .subscribe({
      next: (value) => {
        if (dataSource.onLoaded) {
          try {
            runInInjectionContext(injector, () => {
              dataSource.onLoaded!(state, key, dataSourceValue.parameter, value);
            });
          } catch (callbackError) {
            logger.error(`Error in onLoaded callback for '${key}'`, callbackError as Error);
          }
        }
        store.dispatchAction(new NgssmSetDataSourceValueAction(key, NgssmDataSourceValueStatus.loaded, value));
      },
      error: (error) => {
        logger.error(`Unable to load data for '${key}'`, error);
        if (dataSource.onLoadError) {
          try {
            runInInjectionContext(injector, () => {
              dataSource.onLoadError!(state, key, dataSourceValue.parameter, error);
            });
          } catch (callbackError) {
            logger.error(`Error in onLoadError callback for '${key}'`, callbackError as Error);
          }
        }
        store.dispatchAction(new NgssmSetDataSourceValueAction(key, NgssmDataSourceValueStatus.error, undefined, error));
      }
    });
};
