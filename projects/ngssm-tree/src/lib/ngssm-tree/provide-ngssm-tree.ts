import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { treeNodeLoadingEffectProvider } from './effects/tree-node-loading.effect';
import { treeNodesSearchingEffectProvider } from './effects/tree-nodes-searching.effect';
import { treeNodeExpandReducerProvider } from './reducers/tree-node-expand.reducer';
import { treeNodeSelectionReducerProvider } from './reducers/tree-node-selection.reducer';
import { treeNodesSearchReducerProvider } from './reducers/tree-nodes-search.reducer';
import { treeNodesReducerProvider } from './reducers/tree-nodes.reducer';
import { treesReducerProvider } from './reducers/trees.reducer';

export const provideNgssmTree = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    treesReducerProvider,
    treeNodeExpandReducerProvider,
    treeNodeLoadingEffectProvider,
    treeNodesReducerProvider,
    treeNodeSelectionReducerProvider,
    treeNodesSearchingEffectProvider,
    treeNodesSearchReducerProvider
  ]);
};
