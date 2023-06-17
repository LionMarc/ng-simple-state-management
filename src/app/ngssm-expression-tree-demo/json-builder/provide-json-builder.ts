import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { provideEffect, provideReducers } from 'ngssm-store';

import { JsonNodeEditorReducer, NextNodeIdReducer } from './reducers';
import { JsonNodeEditorEffect } from './effects';

export const provideJsonBuilder = (): EnvironmentProviders => {
  return makeEnvironmentProviders([provideReducers(JsonNodeEditorReducer, NextNodeIdReducer), provideEffect(JsonNodeEditorEffect)]);
};
