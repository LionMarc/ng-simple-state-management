import { EnvironmentProviders, InjectionToken, inject, makeEnvironmentProviders } from '@angular/core';
import { Observable } from 'rxjs';

import { State, Store } from 'ngssm-store';
import { NgssmLoadDataSourceValueAction } from '../actions';

// Type definition for a function that loads data
export type NgssmDataLoading<TData = unknown, TParameter = unknown> = (
  state: State,
  dataSourceKey: string,
  parameter?: TParameter
) => Observable<TData>;

// Type definition for a function that loads additional properties
export type NgssmAdditionalPropertyLoading<TData = unknown> = (
  state: State,
  dataSourceKey: string,
  additionalProperty: string
) => Observable<TData>;

// Interface defining the structure of a data source
// Be careful when using linkedToDataSource or linkedDataSources because no check is done to validate that there is no
// circular dependencies (A => B => C => A, for example).
export interface NgssmDataSource<TData = unknown, TParameter = unknown, TAdditionalProperty = unknown> {
  key: string; // Unique identifier for the data source
  dataLifetimeInSeconds?: number; // Optional lifetime for cached data
  dataLoadingFunc: NgssmDataLoading<TData, TParameter>; // Function to load data
  additionalPropertyLoadingFunc?: NgssmAdditionalPropertyLoading<TAdditionalProperty>; // Optional function to load additional properties
  initialParameter?: TParameter; // Optional initial parameter for the data source
  initialParameterInvalid?: boolean; // Flag indicating if the initial parameter is invalid,
  linkedToDataSource?: string; // If target data source valued is updated, a reload is made for this data source. This is used to force updating this data source.
  linkedDataSources?: string[]; // If current source is updated, all the linked data sources are reloaded. This is used to force updating the other data sources.
}

// Injection token for registering data sources
export const NGSSM_DATA_SOURCE = new InjectionToken<NgssmDataSource>('NGSSM_DATA_SOURCE');

// Optional parameters when registering a data source
export interface NgssmDataSourceProvideOptions<TParameter = unknown, TAdditionalProperty = unknown> {
  dataLifetimeInSeconds?: number; // Optional data lifetime
  initialParameter?: TParameter; // Optional initial parameter
  initialParameterInvalid?: boolean; // Optional flag for invalid initial parameter
  additionalPropertyLoadingFunc?: NgssmAdditionalPropertyLoading<TAdditionalProperty>; // Optional function to load additional properties,
  linkedToDataSource?: string; // If target data source valued is updated, a reload is made for this data source.
  linkedDataSources?: string[]; // If current source is updated, all the linked data sources are reloaded.
}

// Function to provide a data source as an environment provider
export const provideNgssmDataSource = <TData = unknown, TParameter = unknown, TAdditionalProperty = unknown>(
  key: string, // Unique key for the data source
  loadingFunc: NgssmDataLoading<TData, TParameter>, // Function to load data
  options?: NgssmDataSourceProvideOptions<TParameter, TAdditionalProperty> // Optional configuration options
): EnvironmentProviders => {
  return makeEnvironmentProviders([
    {
      provide: NGSSM_DATA_SOURCE,
      useFactory: () => {
        const dataSource: NgssmDataSource<TData, TParameter, TAdditionalProperty> = {
          key,
          dataLifetimeInSeconds: options?.dataLifetimeInSeconds,
          dataLoadingFunc: loadingFunc,
          additionalPropertyLoadingFunc: options?.additionalPropertyLoadingFunc
        };

        if (options?.initialParameter) {
          dataSource.initialParameter = options?.initialParameter;
        }

        if (options?.initialParameterInvalid) {
          dataSource.initialParameterInvalid = options?.initialParameterInvalid;
        }

        if (options?.linkedToDataSource) {
          dataSource.linkedToDataSource = options?.linkedToDataSource;
        }

        if (options?.linkedDataSources) {
          dataSource.linkedDataSources = options?.linkedDataSources;
        }

        return dataSource;
      },
      multi: true
    }
  ]);
};

// Function to dispatch an action to load a data source value
export const ngssmLoadDataSourceValue = (key: string, forceReload = false): (() => boolean) => {
  return () => {
    inject(Store).dispatchAction(new NgssmLoadDataSourceValueAction(key, { forceReload }));
    return true;
  };
};
