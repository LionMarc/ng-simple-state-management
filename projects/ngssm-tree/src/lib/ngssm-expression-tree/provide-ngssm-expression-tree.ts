import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { treeNodeEditionReducerProvider, treeNodeExpandReducerProvider, treesReducerProvider } from './reducers';

export const provideNgssmExpressionTree = (): EnvironmentProviders => {
  return makeEnvironmentProviders([treesReducerProvider, treeNodeExpandReducerProvider, treeNodeEditionReducerProvider]);
};
