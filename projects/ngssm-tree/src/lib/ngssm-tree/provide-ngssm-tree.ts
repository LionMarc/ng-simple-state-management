import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { provideEffects, provideReducers } from 'ngssm-store';

import { TreeNodeLoadingEffect } from './effects/tree-node-loading.effect';
import { TreeNodesSearchingEffect } from './effects/tree-nodes-searching.effect';
import { TreeNodeExpandReducer } from './reducers/tree-node-expand.reducer';
import { TreeNodeSelectionReducer } from './reducers/tree-node-selection.reducer';
import { TreeNodesSearchReducer } from './reducers/tree-nodes-search.reducer';
import { TreeNodesReducer } from './reducers/tree-nodes.reducer';
import { TreesReducer } from './reducers/trees.reducer';

export const provideNgssmTree = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    provideReducers(TreeNodeExpandReducer, TreeNodeSelectionReducer, TreeNodesSearchReducer, TreeNodesReducer, TreesReducer),
    provideEffects(TreeNodeLoadingEffect, TreeNodesSearchingEffect)
  ]);
};
