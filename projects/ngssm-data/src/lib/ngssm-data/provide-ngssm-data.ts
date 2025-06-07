import { EnvironmentProviders, makeEnvironmentProviders, inject, provideAppInitializer } from '@angular/core';

import { Store, provideEffects, provideReducers } from 'ngssm-store';

import { NGSSM_DATA_SOURCE, NgssmDataSource } from './model';
import { DataSourceValueReducer, DataSourcesRegistrationReducer } from './reducers';
import { DataLoadingEffect } from './effects';
import { NgssmRegisterDataSourcesAction } from './actions';
import { postLoadingActionExecutorInitializer } from './post-loading-action-executor';
import { dataSourcesLinkerInitializer } from './data-sources-linker';

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
    provideReducers(DataSourcesRegistrationReducer, DataSourceValueReducer),
    provideEffects(DataLoadingEffect)
  ]);
};
