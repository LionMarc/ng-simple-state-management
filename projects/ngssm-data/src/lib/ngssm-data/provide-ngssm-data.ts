import { APP_INITIALIZER, EnvironmentProviders, Inject, Injectable, Optional, makeEnvironmentProviders } from '@angular/core';

import { Store, provideEffects, provideReducers } from 'ngssm-store';

import { NGSSM_DATA_SOURCE, NgssmDataSource } from './model';
import { NgssmInitDataSourceValuesAction } from './actions';
import { DataSourceValueReducer, DataSourcesInitializationReducer } from './reducers';
import { DataLoadingEffect } from './effects';

@Injectable({
  providedIn: 'root'
})
export class NgssmDataSourceCollection {
  constructor(@Inject(NGSSM_DATA_SOURCE) @Optional() public dataSources: NgssmDataSource[]) {}
}

const initDataSourceValues = (store: Store, dataSourceCollection: NgssmDataSourceCollection): (() => void) => {
  return () => {
    const dataSources = dataSourceCollection.dataSources ?? [];
    if (dataSources.length > 0) {
      store.dispatchAction(new NgssmInitDataSourceValuesAction(dataSources));
    }
  };
};

export const provideNgssmData = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    {
      provide: APP_INITIALIZER,
      useFactory: initDataSourceValues,
      deps: [Store, NgssmDataSourceCollection],
      multi: true
    },
    provideReducers(DataSourcesInitializationReducer, DataSourceValueReducer),
    provideEffects(DataLoadingEffect)
  ]);
};
