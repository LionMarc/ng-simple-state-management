import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { JsonNodeEditorReducer, NextNodeIdReducer } from './reducers';
import { jsonNodeEditorEffectProvider } from './effects';
import { provideReducers } from 'ngssm-store';

export const provideJsonBuilder = (): EnvironmentProviders => {
  return makeEnvironmentProviders([jsonNodeEditorEffectProvider, provideReducers(JsonNodeEditorReducer, NextNodeIdReducer)]);
};
