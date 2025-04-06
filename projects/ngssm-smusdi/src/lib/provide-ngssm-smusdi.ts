import { EnvironmentProviders, inject, makeEnvironmentProviders, provideAppInitializer } from '@angular/core';

import { Store } from 'ngssm-store';
import { NgssmLoadDataSourceValueAction, provideNgssmDataSource } from 'ngssm-data';

import { serviceInfoKey, serviceInfoLoader } from './service-info';

const loadServiceInfoAtStartup = async () => {
  const store = inject(Store);
  store.dispatchAction(new NgssmLoadDataSourceValueAction(serviceInfoKey, { forceReload: true }));
  return true;
};

export const provideNgssmSmusdi = (infoUrl = '../info'): EnvironmentProviders => {
  return makeEnvironmentProviders([
    provideNgssmDataSource(serviceInfoKey, serviceInfoLoader, { dataLifetimeInSeconds: 600, initialParameter: infoUrl }),
    provideAppInitializer(loadServiceInfoAtStartup)
  ]);
};
