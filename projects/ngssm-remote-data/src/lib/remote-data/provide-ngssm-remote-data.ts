import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { NGSSM_STATE_INITIALIZER, provideReducer } from 'ngssm-store';

import { cachesDisplayEffectProvider, remoteDataLoadingEffectProvider } from './effects';
import { RemoteDataReducer } from './reducers/remote-data.reducer';
import { RemoteDataStateInitializer } from './remote-data-state-initializer';

export const provideNgssmRemoteData = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    provideReducer(RemoteDataReducer),
    remoteDataLoadingEffectProvider,
    cachesDisplayEffectProvider,
    { provide: NGSSM_STATE_INITIALIZER, useClass: RemoteDataStateInitializer, multi: true }
  ]);
};
