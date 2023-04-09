import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { jsonNodeEditorReducerProvider, nextNodeIdReducerProvider } from './reducers';
import { jsonNodeEditorEffectProvider } from './effects';

export const provideJsonBuilder = (): EnvironmentProviders => {
  return makeEnvironmentProviders([jsonNodeEditorReducerProvider, jsonNodeEditorEffectProvider, nextNodeIdReducerProvider]);
};
