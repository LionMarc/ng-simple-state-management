import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { NgssmDataLoading } from 'ngssm-data';

import { State } from 'ngssm-store';

import { OauthInfo } from './oauth-info';

export const serviceInfoKey = 'service-info';

export interface ProvidedCustomElements {
  script: string;
  customElements: string[];
}

export interface ServiceInfo {
  serviceName: string;
  serviceVersion: string;
  environment: string;
  oauth?: OauthInfo;
  customElements?: ProvidedCustomElements;
  serviceUrl?: string;
}

export const serviceInfoLoader: NgssmDataLoading<ServiceInfo, string> = (_: State, dataSourceKey, parameter?: string) => {
  const httpClient = inject(HttpClient);
  return httpClient.get<ServiceInfo>(parameter ?? '');
};
