import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { State } from 'ngssm-store';
import { NgssmDataLoading } from 'ngssm-data';

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

export const serviceInfoLoader: NgssmDataLoading<ServiceInfo, string> = (_: State, parameter?: string) => {
  const httpClient = inject(HttpClient);
  return httpClient.get<ServiceInfo>(parameter ?? '');
};
