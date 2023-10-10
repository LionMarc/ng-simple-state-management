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
