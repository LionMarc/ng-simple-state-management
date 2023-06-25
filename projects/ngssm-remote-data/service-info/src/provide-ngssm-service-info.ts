import { APP_INITIALIZER, EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';

import { provideRemoteDataFunc } from 'ngssm-remote-data';
import { Store } from 'ngssm-store';

import { NGSSM_SERVICE_INFO_URL, serviceInfoInitializerFactory, serviceInfoKey, serviceInfoLoader } from './model';

export const provideNgssmServiceInfo = (infoUrl = '../info'): EnvironmentProviders => {
  return makeEnvironmentProviders([
    { provide: NGSSM_SERVICE_INFO_URL, useValue: infoUrl },
    provideRemoteDataFunc(serviceInfoKey, serviceInfoLoader),
    {
      provide: APP_INITIALIZER,
      useFactory: serviceInfoInitializerFactory,
      deps: [Store],
      multi: true
    }
  ]);
};
