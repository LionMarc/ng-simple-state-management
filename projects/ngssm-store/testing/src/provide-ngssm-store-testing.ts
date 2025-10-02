import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { Store } from 'ngssm-store';

import { StoreMock } from './store-mock';

/**
 * Provides a testing environment provider for the `Store` service using a mock implementation.
 *
 * This function returns Angular environment providers that replace the actual `Store` service
 * with a `StoreMock` instance, allowing for isolated and controlled testing of components or services
 * that depend on the `Store`.
 *
 * @param action Optional callback function that receives the mock `Store` instance. Can be used to configure
 *               or manipulate the mock store before it is provided to the testing environment.
 * @returns The environment providers configured with the `StoreMock`.
 */
export const provideNgssmStoreTesting = (action?: (store: Store) => void): EnvironmentProviders => {
  const store = new StoreMock({});
  if (action) {
    action(store as unknown as Store);
  }
  return makeEnvironmentProviders([{ provide: Store, useValue: store }]);
};
