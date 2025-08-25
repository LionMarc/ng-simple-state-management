import { EnvironmentProviders, makeEnvironmentProviders, inject, provideAppInitializer } from '@angular/core';

import { Store, provideEffectFunc, provideEffects, provideReducers } from 'ngssm-store';

import { NGSSM_DATA_SOURCE, NgssmDataSource } from './model';
import { DataSourceValueReducer, DataSourcesRegistrationReducer, LoadDataSourceValueReducer } from './reducers';
import { DataLoadingEffect } from './effects';
import { NgssmDataActionType, NgssmRegisterDataSourcesAction } from './actions';
import { postLoadingActionExecutorInitializer } from './post-loading-action-executor';
import { dataSourcesLinkerInitializer } from './data-sources-linker';
import { dependentDataSourceLoadInitializer, loadDataSourceWithDependencyEffect } from './data-source-with-dependency';

const initDataSourceValues = () => {
  const store = inject(Store);
  const dataSources = (inject(NGSSM_DATA_SOURCE, { optional: true }) as unknown as NgssmDataSource[]) ?? [];
  if (dataSources.length > 0) {
    store.dispatchAction(new NgssmRegisterDataSourcesAction(dataSources));
  }
};

export const provideNgssmData = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    provideAppInitializer(initDataSourceValues),
    provideAppInitializer(postLoadingActionExecutorInitializer),
    provideAppInitializer(dataSourcesLinkerInitializer),
    provideAppInitializer(dependentDataSourceLoadInitializer),
    provideReducers(DataSourcesRegistrationReducer, DataSourceValueReducer, LoadDataSourceValueReducer),
    provideEffects(DataLoadingEffect),
    provideEffectFunc(NgssmDataActionType.loadDataSourceValue, loadDataSourceWithDependencyEffect)
  ]);
};
