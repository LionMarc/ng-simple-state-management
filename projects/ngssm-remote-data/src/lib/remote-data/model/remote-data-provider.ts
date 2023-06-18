import { EnvironmentProviders, InjectionToken, Type, makeEnvironmentProviders } from '@angular/core';
import { Observable } from 'rxjs';
import { RemoteDataGetterParams } from './remote-data-getter-params';

export interface RemoteDataProvider<TData = any, TValue = any> {
  readonly remoteDataKey: string;
  readonly cacheDurationInSeconds?: number;

  get(params?: RemoteDataGetterParams<TValue>): Observable<TData>;
}

export const NGSSM_REMOTE_DATA_PROVIDER = new InjectionToken<RemoteDataProvider>('NGSSM_REMOTE_DATA_PROVIDER');

export const provideRemoteDataProviders = (...providers: Type<RemoteDataProvider>[]): EnvironmentProviders => {
  return makeEnvironmentProviders(providers.map((provider) => ({ provide: NGSSM_REMOTE_DATA_PROVIDER, useClass: provider, multi: true })));
};

export interface RemoteDataLoadingFunc<TData = any, TValue = any> {
  (params?: RemoteDataGetterParams<TValue>): Observable<TData>;
}

export const provideRemoteDataFunc = <TData = any, TValue = any>(
  remoteDataKey: string,
  remoteDataLoadingFunc: RemoteDataLoadingFunc<TData, TValue>,
  cacheDurationInSeconds?: number
): EnvironmentProviders => {
  return makeEnvironmentProviders([
    {
      provide: NGSSM_REMOTE_DATA_PROVIDER,
      useFactory: () => {
        const provider: RemoteDataProvider<TData, TValue> = {
          remoteDataKey,
          cacheDurationInSeconds,
          get: remoteDataLoadingFunc
        };
        return provider;
      },
      multi: true
    }
  ]);
};
