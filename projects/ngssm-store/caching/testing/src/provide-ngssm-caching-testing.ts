import { EnvironmentProviders, inject, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';

import { Logger, Store } from 'ngssm-store';
import { StoreMock } from 'ngssm-store/testing';
import { NgssmCachingStateSpecification } from 'ngssm-store/caching';

import { NgssmCachedItemSetter } from './ngssm-cached-item-setter';

/**
 * App initializer that sets up the NgssmCaching state in the StoreMock for testing purposes.
 * Throws an error if StoreMock is not registered.
 */
export const ngssmCachingStateInitializer = () => {
  const logger = inject(Logger);
  logger.information('[ngssm-caching-testing] Initialization of state');
  const store = inject(Store);
  if (!(store instanceof StoreMock)) {
    throw new Error('StoreMock is not registered.');
  }

  store.stateValue = {
    ...store.stateValue,
    [NgssmCachingStateSpecification.featureStateKey]: NgssmCachingStateSpecification.initialState
  };
};

/**
 * Provides environment providers for NgssmCaching testing, including the state initializer.
 */
export const provideNgssmCachingTesting = (): EnvironmentProviders => {
  return makeEnvironmentProviders([provideAppInitializer(ngssmCachingStateInitializer), NgssmCachedItemSetter]);
};
