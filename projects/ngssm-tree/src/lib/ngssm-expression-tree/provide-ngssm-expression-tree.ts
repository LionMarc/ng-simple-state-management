import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { provideReducers } from 'ngssm-store';

import { CutAndPasteReducer, TreeNodeEditionReducer, TreeNodeExpandReducer, TreesReducer } from './reducers';

export const provideNgssmExpressionTree = (): EnvironmentProviders => {
  return makeEnvironmentProviders([provideReducers(CutAndPasteReducer, TreeNodeEditionReducer, TreeNodeExpandReducer, TreesReducer)]);
};
