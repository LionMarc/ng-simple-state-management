import { EnvironmentProviders, inject, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';

import { Logger, Store } from 'ngssm-store';
import { StoreMock } from 'ngssm-store/testing';

import { NgssmRemoteCallStateSpecification, NgssmRemoteCallStateInitializer } from 'ngssm-remote-data';
import { NgssmRemoteCallSetter } from './ngssm-remote-call-setter';

/**
 * App initializer that sets up the NgssmRemoteCall state and sources in the StoreMock for testing purposes.
 * Throws an error if StoreMock is not registered.
 */
export const ngssmRemoteCallStateAndRemoteCallsInitializer = () => {
  const logger = inject(Logger);
  logger.information('[ngssm-remote-call-testing] Initialization of state and sources');
  const store = inject(Store);
  if (!(store instanceof StoreMock)) {
    throw new Error('StoreMock is not registered.');
  }

  store.stateValue = {
    ...store.stateValue,
    [NgssmRemoteCallStateSpecification.featureStateKey]: NgssmRemoteCallStateSpecification.initialState
  };

  const stateInitializer = inject(NgssmRemoteCallStateInitializer);
  store.stateValue = stateInitializer.initializeState(store.stateValue);
};

/**
 * Provides environment providers for remote call testing, including the state initializer and helper services.
 */
export const provideNgssmRemoteCallTesting = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    provideAppInitializer(ngssmRemoteCallStateAndRemoteCallsInitializer),
    NgssmRemoteCallStateInitializer,
    NgssmRemoteCallSetter
  ]);
};
