import { InjectionToken, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LoadRemoteDataAction, RemoteDataLoadingFunc } from 'ngssm-remote-data';
import { Store } from 'ngssm-store';

import { OauthInfo } from './oauth-info';

export const serviceInfoKey = 'service-info';

export interface ServiceInfo {
  serviceName: string;
  serviceVersion: string;
  environment: string;
  oauth?: OauthInfo;
}

export const NGSSM_SERVICE_INFO_URL = new InjectionToken<string>('NGSSM_SERVICE_INFO_URL');

export const serviceInfoLoader: RemoteDataLoadingFunc<ServiceInfo, any> = () => {
  const serviceUrl = inject(NGSSM_SERVICE_INFO_URL);
  return inject(HttpClient).get<ServiceInfo>(serviceUrl);
};

export const serviceInfoInitializerFactory = (store: Store): (() => Promise<boolean>) => {
  return async () => {
    store.dispatchAction(new LoadRemoteDataAction(serviceInfoKey, { forceReload: true }));
    return true;
  };
};
