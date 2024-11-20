import { InjectionToken, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LoadRemoteDataAction, RemoteDataLoadingFunc } from 'ngssm-remote-data';
import { Store } from 'ngssm-store';
import { ServiceInfo } from 'ngssm-store/smusdi';

export const serviceInfoKey = 'service-info';

export const NGSSM_SERVICE_INFO_URL = new InjectionToken<string>('NGSSM_SERVICE_INFO_URL');

export const serviceInfoLoader: RemoteDataLoadingFunc<ServiceInfo, any> = () => {
  const serviceUrl = inject(NGSSM_SERVICE_INFO_URL);
  return inject(HttpClient).get<ServiceInfo>(serviceUrl);
};

export const serviceInfoInitializerFactory = (): (() => Promise<boolean>) => {
  return async () => {
    inject(Store).dispatchAction(new LoadRemoteDataAction(serviceInfoKey, { forceReload: true }));
    return true;
  };
};
