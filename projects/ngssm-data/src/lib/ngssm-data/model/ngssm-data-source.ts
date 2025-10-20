import { EnvironmentProviders, InjectionToken, inject, makeEnvironmentProviders } from '@angular/core';
import { Observable } from 'rxjs';

import { State, Store } from 'ngssm-store';
import { NgssmLoadDataSourceValueAction } from '../actions';

/**
 * Function signature for loading a data source value.
 * - state: the current global application state.
 * - dataSourceKey: the unique key of the data source being loaded.
 * - parameter: optional parameter passed to the loader.
 *
 * Must return an Observable that emits the requested data.
 */
export type NgssmDataLoading<TData = unknown, TParameter = unknown> = (
  state: State,
  dataSourceKey: string,
  parameter?: TParameter
) => Observable<TData>;

/**
 * Function signature for loading an additional property of a data source (e.g. row detail).
 * - state: the current global application state.
 * - dataSourceKey: the unique key of the data source.
 * - additionalProperty: the name of the additional property to load.
 *
 * Must return an Observable that emits the requested additional property data.
 */
export type NgssmAdditionalPropertyLoading<TData = unknown> = (
  state: State,
  dataSourceKey: string,
  additionalProperty: string
) => Observable<TData>;

/**
 * Describes a data source and its optional behaviours.
 *
 * - key: unique identifier for the data source.
 * - dataLifetimeInSeconds: optional TTL for cached data (seconds).
 * - dataLoadingFunc: required function that loads the main data.
 * - additionalPropertyLoadingFunc: optional function to load named additional properties independently.
 * - initialParameter: optional parameter used initially when registering the data source.
 * - initialParameterInvalid: flag indicating the initial parameter should be considered invalid.
 * - linkedToDataSource: if specified, this data source is reloaded when the target source is updated.
 * - linkedDataSources: list of other data sources to reload when this source is updated.
 * - dependsOnDataSource: optional dependency key; when loading this source, the dependency will be loaded first.
 */
export interface NgssmDataSource<TData = unknown, TParameter = unknown, TAdditionalProperty = unknown> {
  key: string;
  dataLifetimeInSeconds?: number;
  dataLoadingFunc: NgssmDataLoading<TData, TParameter>;
  additionalPropertyLoadingFunc?: NgssmAdditionalPropertyLoading<TAdditionalProperty>;
  initialParameter?: TParameter;
  initialParameterInvalid?: boolean;
  linkedToDataSource?: string;
  linkedDataSources?: string[];
  dependsOnDataSource?: string;
}

/**
 * Injection token used to register data sources via DI.
 * Provide one or several NgssmDataSource objects using this token (multi: true).
 */
export const NGSSM_DATA_SOURCE = new InjectionToken<NgssmDataSource>('NGSSM_DATA_SOURCE');

/**
 * Options accepted when providing a data source via provideNgssmDataSource.
 * See individual properties for behaviour.
 */
export interface NgssmDataSourceProvideOptions<TParameter = unknown, TAdditionalProperty = unknown> {
  dataLifetimeInSeconds?: number;
  initialParameter?: TParameter;
  initialParameterInvalid?: boolean;
  additionalPropertyLoadingFunc?: NgssmAdditionalPropertyLoading<TAdditionalProperty>;
  linkedToDataSource?: string;
  linkedDataSources?: string[];
  dependsOnDataSource?: string;
}

/**
 * Helper function to register a data source in Angular's environment providers.
 * Use provideNgssmData() at app startup to pick up data sources registered via this helper.
 */
export const provideNgssmDataSource = <TData = unknown, TParameter = unknown, TAdditionalProperty = unknown>(
  key: string,
  loadingFunc: NgssmDataLoading<TData, TParameter>,
  options?: NgssmDataSourceProvideOptions<TParameter, TAdditionalProperty>
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

        if (options?.dependsOnDataSource) {
          dataSource.dependsOnDataSource = options?.dependsOnDataSource;
        }

        return dataSource;
      },
      multi: true
    }
  ]);
};

/**
 * Guard / initializer helper that dispatches a NgssmLoadDataSourceValueAction for the given key.
 * Returns a function suitable for use in Router canActivate (or app initializers) that always returns true.
 */
export const ngssmLoadDataSourceValue = (key: string, forceReload = false): (() => boolean) => {
  return () => {
    inject(Store).dispatchAction(new NgssmLoadDataSourceValueAction(key, { forceReload }));
    return true;
  };
};
