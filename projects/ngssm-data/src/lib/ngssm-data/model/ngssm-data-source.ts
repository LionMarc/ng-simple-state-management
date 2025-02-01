import { EnvironmentProviders, InjectionToken, inject, makeEnvironmentProviders } from '@angular/core';
import { Observable } from 'rxjs';

import { State, Store } from 'ngssm-store';
import { NgssmLoadDataSourceValueAction } from '../actions';

export type NgssmDataLoading<TData = unknown, TParameter = unknown> = (state: State, parameter?: TParameter, additionalProperty?: string) => Observable<TData>;

export interface NgssmDataSource<TData = unknown, TParameter = unknown> {
  key: string;
  dataLifetimeInSeconds?: number;
  dataLoadingFunc: NgssmDataLoading<TData, TParameter>;
  initialParameter?: TParameter;
  initialParameterInvalid?: boolean;
}

export const NGSSM_DATA_SOURCE = new InjectionToken<NgssmDataSource>('NGSSM_DATA_SOURCE');

// Why not creating an app intializer that dispatch a NgssmRegisterDataSourceAction action
// instead of registering the data source ?
export const provideNgssmDataSource = <TData = unknown, TParameter = unknown>(
  key: string,
  loadingFunc: NgssmDataLoading<TData, TParameter>,
  dataLifetimeInSeconds?: number,
  initialParameter?: TParameter,
  initialParameterInvalid?: boolean
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

        if (initialParameter) {
          dataSource.initialParameter = initialParameter;
        }

        if (initialParameterInvalid) {
          dataSource.initialParameterInvalid = initialParameterInvalid;
        }

        return dataSource;
      },
      multi: true
    }
  ]);
};

export const ngssmLoadDataSourceValue = (key: string, forceReload = false): (() => boolean) => {
  return () => {
    inject(Store).dispatchAction(new NgssmLoadDataSourceValueAction(key, { forceReload }));
    return true;
  };
};
