import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { NGSSM_STATE_INITIALIZER } from 'ngssm-store';
import { NgssmRemoteCallStateInitializer } from './ngssm-remote-call-state-initializer';
import { remoteCallReducerProvider, remoteCallSetterReducerProvider } from './reducers';

export const provideNgssmRemoteCall = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    { provide: NGSSM_STATE_INITIALIZER, useClass: NgssmRemoteCallStateInitializer, multi: true },
    remoteCallReducerProvider,
    remoteCallSetterReducerProvider
  ]);
};
