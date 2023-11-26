import { APP_INITIALIZER, EnvironmentProviders, Inject, Injectable, Optional, inject, makeEnvironmentProviders } from '@angular/core';

import { Store, provideReducers } from 'ngssm-store';

import { NGSSM_DATA_SOURCE, NgssmDataSource } from './model';
import { NgssmInitDataSourceValuesAction } from './actions';
import { DataSourcesInitializationReducer } from './reducers';

@Injectable({
  providedIn: 'root'
})
export class NgssmDataSourceCollection {
  constructor(@Inject(NGSSM_DATA_SOURCE) @Optional() public dataSources: NgssmDataSource[]) {}
}

const initDataSourceValues = (store: Store, dataSourceCollection: NgssmDataSourceCollection): (() => void) => {
  return () => {
    const keys = (dataSourceCollection.dataSources ?? []).map((d) => d.key);
    if (keys.length > 0) {
      store.dispatchAction(new NgssmInitDataSourceValuesAction(keys));
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
    provideReducers(DataSourcesInitializationReducer)
  ]);
};
