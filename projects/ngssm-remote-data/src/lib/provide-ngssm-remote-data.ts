import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { NGSSM_STATE_INITIALIZER } from 'ngssm-store';

import { remoteDataLoadingEffectProvider } from './effects/remote-data-loading.effect';
import { remoteDataReducerProvider } from './reducers/remote-data.reducer';
import { RemoteDataStateInitializer } from './remote-data-state-initializer';

export const provideNgssmRemoteData = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    remoteDataReducerProvider,
    remoteDataLoadingEffectProvider,
    { provide: NGSSM_STATE_INITIALIZER, useClass: RemoteDataStateInitializer, multi: true }
  ]);
};
