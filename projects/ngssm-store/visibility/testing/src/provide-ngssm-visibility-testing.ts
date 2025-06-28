import { EnvironmentProviders, inject, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';

import { Logger, Store } from 'ngssm-store';
import { StoreMock } from 'ngssm-store/testing';
import { NgssmVisibilityStateSpecification } from 'ngssm-store/visibility';

import { NgssmVisibilitySetter } from './ngssm-visibility-setter';

/**
 * App initializer that sets up the ngssm state visibility in the StoreMock for testing purposes.
 * Throws an error if StoreMock is not registered.
 */
export const ngssmVisibilityStateInitializer = () => {
  const logger = inject(Logger);
  logger.information('[ngssm-visibility-testing] Initialization of state');
  const store = inject(Store);
  if (!(store instanceof StoreMock)) {
    throw new Error('StoreMock is not registered.');
  }

  store.stateValue = {
    ...store.stateValue,
    [NgssmVisibilityStateSpecification.featureStateKey]: NgssmVisibilityStateSpecification.initialState
  };
};

/**
 * Provides environment providers for ngssm visibility testing, including the state initializer.
 */
export const provideNgssmVisibilityTesting = (): EnvironmentProviders => {
  return makeEnvironmentProviders([provideAppInitializer(ngssmVisibilityStateInitializer), NgssmVisibilitySetter]);
};
