import { OauthInfo } from './oauth-info';

export const serviceInfoKey = 'service-info';

export interface ServiceInfo {
  serviceName: string;
  serviceVersion: string;
  environment: string;
  oauth?: OauthInfo;
}
