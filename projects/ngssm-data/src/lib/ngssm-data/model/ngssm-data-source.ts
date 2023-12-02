import { EnvironmentProviders, InjectionToken, inject, makeEnvironmentProviders } from '@angular/core';
import { Observable } from 'rxjs';

import { State, Store } from 'ngssm-store';
import { NgssmLoadDataSourceValueAction } from '../actions';

export interface NgssmDataLoading<TData = any, TParameter = any> {
  (state: State, parameter?: TParameter): Observable<TData>;
}

export interface NgssmDataSource<TData = any, TParameter = any> {
  key: string;
  dataLifetimeInSeconds?: number;
  dataLoadingFunc: NgssmDataLoading<TData, TParameter>;
}

export const NGSSM_DATA_SOURCE = new InjectionToken<NgssmDataSource>('NGSSM_DATA_SOURCE');

export const provideNgssmDataSource = <TData = any, TParameter = any>(
  key: string,
  loadingFunc: NgssmDataLoading<TData, TParameter>,
  dataLifetimeInSeconds?: number
): EnvironmentProviders => {
  return makeEnvironmentProviders([
    {
      provide: NGSSM_DATA_SOURCE,
      useFactory: () => {
        const dataSource: NgssmDataSource<TData, TParameter> = {
          key,
          dataLifetimeInSeconds,
          dataLoadingFunc: loadingFunc
        };
        return dataSource;
      },
      multi: true
    }
  ]);
};

export const ngssmLoadDataSourceValue = (key: string, forceReload: boolean = false): (() => boolean) => {
  return () => {
    inject(Store).dispatchAction(new NgssmLoadDataSourceValueAction(key, forceReload));
    return true;
  };
};
