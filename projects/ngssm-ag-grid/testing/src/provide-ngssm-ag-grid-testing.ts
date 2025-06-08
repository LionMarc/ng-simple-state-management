import { EnvironmentProviders, inject, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';

import { Logger, Store } from 'ngssm-store';
import { StoreMock } from 'ngssm-store/testing';
import { AgGridStateSpecification } from 'ngssm-ag-grid';

/**
 * App initializer that sets up the AgGrid state in the StoreMock for testing purposes.
 * Throws an error if StoreMock is not registered.
 */
export const ngssmAgGridStateInitializer = () => {
  const logger = inject(Logger);
  logger.information('[ngssm-ag-grid-testing] Initialization of state and sources');
  const store = inject(Store);
  if (!(store instanceof StoreMock)) {
    throw new Error('StoreMock is not registered.');
  }

  store.stateValue = {
    ...store.stateValue,
    [AgGridStateSpecification.featureStateKey]: AgGridStateSpecification.initialState
  };
};

/**
 * Provides environment providers for AgGrid testing, including the state initializer.
 */
export const provideNgssmAgGridTesting = (): EnvironmentProviders => {
  return makeEnvironmentProviders([provideAppInitializer(ngssmAgGridStateInitializer)]);
};
