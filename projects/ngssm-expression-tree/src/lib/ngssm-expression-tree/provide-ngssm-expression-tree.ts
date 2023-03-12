import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { treesReducerProvider } from './reducers';

export const provideNgssmExpressionTree = (): EnvironmentProviders => {
  return makeEnvironmentProviders([treesReducerProvider]);
};
