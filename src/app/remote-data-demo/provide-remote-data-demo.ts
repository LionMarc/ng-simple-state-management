import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideNgssmRemoteCallConfig } from 'ngssm-remote-data';
import { RemoteDataDemoActionType } from './actions';

export const provideRemoteDataDemo = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    provideNgssmRemoteCallConfig({
      id: 'demo',
      triggeredActionType: RemoteDataDemoActionType.startRemoteCall,
      resultActionType: RemoteDataDemoActionType.endRemoteCall
    })
  ]);
};
