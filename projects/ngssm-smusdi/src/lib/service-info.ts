import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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

export const serviceInfoLoader = (_: State, dataSourceKey: string, parameter?: string): Observable<ServiceInfo> => {
  const httpClient = inject(HttpClient);
  return httpClient.get<ServiceInfo>(parameter ?? '');
};
