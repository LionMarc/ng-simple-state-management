import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { provideNgssmRemoteCallConfig } from 'ngssm-remote-data';
import { provideReducer } from 'ngssm-store';

import { RemoteDataDemoActionType } from './actions';
import { RemoteDataDemoReducer } from './reducers/remote-data-demo.reducer';

export const provideRemoteDataDemo = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    provideNgssmRemoteCallConfig({
      id: 'demo',
      triggeredActionTypes: [RemoteDataDemoActionType.startRemoteCall],
      resultActionTypes: [RemoteDataDemoActionType.endRemoteCall]
    }),
    provideReducer(RemoteDataDemoReducer)
  ]);
};
