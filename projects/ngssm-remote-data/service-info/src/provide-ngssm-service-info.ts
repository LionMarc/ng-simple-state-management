import { EnvironmentProviders, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';

import { provideRemoteDataFunc } from 'ngssm-remote-data';

import { NGSSM_SERVICE_INFO_URL, serviceInfoInitializerFactory, serviceInfoKey, serviceInfoLoader } from './model';

export const provideNgssmServiceInfo = (infoUrl = '../info'): EnvironmentProviders => {
  return makeEnvironmentProviders([
    { provide: NGSSM_SERVICE_INFO_URL, useValue: infoUrl },
    provideRemoteDataFunc(serviceInfoKey, serviceInfoLoader),
    provideAppInitializer(serviceInfoInitializerFactory())
  ]);
};
