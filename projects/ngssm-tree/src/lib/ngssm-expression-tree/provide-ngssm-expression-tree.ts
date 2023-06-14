import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import {
  cutAndPasteReducerProvider,
  treeNodeEditionReducerProvider,
  treeNodeExpandReducerProvider,
  treesReducerProvider
} from './reducers';

export const provideNgssmExpressionTree = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    treesReducerProvider,
    treeNodeExpandReducerProvider,
    treeNodeEditionReducerProvider,
    cutAndPasteReducerProvider
  ]);
};
