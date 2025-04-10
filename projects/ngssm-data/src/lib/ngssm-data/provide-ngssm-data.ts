import { EnvironmentProviders, Inject, Injectable, Optional, makeEnvironmentProviders, inject, provideAppInitializer } from '@angular/core';

import { Store, provideEffects, provideReducers } from 'ngssm-store';

import { NGSSM_DATA_SOURCE, NgssmDataSource } from './model';
import { DataSourceValueReducer, DataSourcesRegistrationReducer } from './reducers';
import { DataLoadingEffect } from './effects';
import { NgssmRegisterDataSourcesAction } from './actions';
import { postLoadingActionExecutorInitializer } from './post-loading-action-executor';

@Injectable({
  providedIn: 'root'
})
export class NgssmDataSourceCollection {
  constructor(@Inject(NGSSM_DATA_SOURCE) @Optional() public dataSources: NgssmDataSource[]) {}
}

const initDataSourceValues = () => {
  const store = inject(Store);
  const dataSourceCollection = inject(NgssmDataSourceCollection);
  const dataSources = dataSourceCollection.dataSources ?? [];
  if (dataSources.length > 0) {
    store.dispatchAction(new NgssmRegisterDataSourcesAction(dataSources));
  }
};

export const provideNgssmData = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    provideAppInitializer(initDataSourceValues),
    provideReducers(DataSourcesRegistrationReducer, DataSourceValueReducer),
    provideEffects(DataLoadingEffect),
    provideAppInitializer(postLoadingActionExecutorInitializer)
  ]);
};
