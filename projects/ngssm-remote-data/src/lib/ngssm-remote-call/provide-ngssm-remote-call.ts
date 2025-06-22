import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { NGSSM_STATE_INITIALIZER, provideReducers } from 'ngssm-store';

import { NgssmRemoteCallStateInitializer } from './ngssm-remote-call-state-initializer';
import { RemoteCallReducer, RemoteCallSetterReducer } from './reducers';

export const provideNgssmRemoteCall = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    { provide: NGSSM_STATE_INITIALIZER, useClass: NgssmRemoteCallStateInitializer, multi: true },
    provideReducers(RemoteCallSetterReducer, RemoteCallReducer)
  ]);
};
