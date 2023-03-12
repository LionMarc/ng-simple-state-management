import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { treeNodeExpandReducerProvider, treesReducerProvider } from './reducers';

export const provideNgssmExpressionTree = (): EnvironmentProviders => {
  return makeEnvironmentProviders([treesReducerProvider, treeNodeExpandReducerProvider]);
};
