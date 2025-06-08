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
 * @returns {EnvironmentProviders} The environment providers configured with the `StoreMock`.
 */
export const provideNgssmStoreTesting = (): EnvironmentProviders => {
  return makeEnvironmentProviders([{ provide: Store, useValue: new StoreMock({}) }]);
};
