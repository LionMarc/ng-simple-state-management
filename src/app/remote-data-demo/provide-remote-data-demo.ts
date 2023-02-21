import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideNgssmRemoteCallConfig } from 'ngssm-remote-data';
import { RemoteDataDemoActionType } from './actions';
import { remoteDataDemoReducerProvider } from './reducers/remote-data-demo.reducer';

export const provideRemoteDataDemo = (): EnvironmentProviders => {
  return makeEnvironmentProviders([
    provideNgssmRemoteCallConfig({
      id: 'demo',
      triggeredActionType: RemoteDataDemoActionType.startRemoteCall,
      resultActionType: RemoteDataDemoActionType.endRemoteCall
    }),
    remoteDataDemoReducerProvider
  ]);
};
