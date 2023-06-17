import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { NGSSM_STATE_INITIALIZER, provideEffects, provideReducer } from 'ngssm-store';

import { CachesDisplayEffect, RemoteDataLoadingEffect } from './effects';
import { RemoteDataReducer } from './reducers/remote-data.reducer';
import { RemoteDataStateInitializer } from './remote-data-state-initializer';

export const provideNgssmRemoteData = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    provideReducer(RemoteDataReducer),
    provideEffects(CachesDisplayEffect, RemoteDataLoadingEffect),
    { provide: NGSSM_STATE_INITIALIZER, useClass: RemoteDataStateInitializer, multi: true }
  ]);
};
